// NOTE: _Heavily_ vibe-coded. My C is very rusty (pun very much not intended).

/*
 * Force-directed graph simulation compiled to WebAssembly.
 *
 * d3-force was originally used but brought additional JS overhead and runs on the main thread,
 * This uses a minimal C implementation without any dependencies.
 *
 * Defined memory layout (passed from WASM memory):
 *   [0,            N*24)   Node array;     6 floats: x, y, vx, vy, size/bias, collider size
 *   [N*24,         +L*12)  Link array;     2 ints + 1 float: source, target, bias
 *   [N*24+L*12,    +N*4)   node_next[];    per-node linked-list next pointer
 *   [+N*4,         +H^2*4) cell_head[];    per-cell list head (-1 = empty)
 *   [+H^2*4,       +32)    QuadCtx;        Barnes-Hut traversal context (8 * 4 bytes)
 *   [+32,          +...)   Cell arrays     finest level first, coarser levels appended
 *
 * where N := node_count, L := link_count, H := recurse_level = max(1, half_level >> 1),
 * where half_level is the smallest power-of-2 p with p^2 >= N.
 */

/* Typed memory access via integer byte-offsets.
 * Avoids strict-aliasing unified buffer on wasm32 (where int == pointer width)
 * zero-cost after inlining. */
static __inline__ float read_f32(int ptr) {
  float v;
  __builtin_memcpy(&v, (const char *)ptr, 4);
  return v;
}
static __inline__ int read_i32(int ptr) {
  int v;
  __builtin_memcpy(&v, (const char *)ptr, 4);
  return v;
}
static __inline__ void write_f32(int ptr, float v) { __builtin_memcpy((char *)ptr, &v, 4); }
static __inline__ void write_i32(int ptr, int v) { __builtin_memcpy((char *)ptr, &v, 4); }

// EXPL: Memory layout accessors: compute byte offsets for nodes, links, cells, and context fields.
#define NODE(base, i) ((base) + (i) * 24)
#define NODE_X(base, i) (NODE(base, i) + 0)   /* float: x position */
#define NODE_Y(base, i) (NODE(base, i) + 4)   /* float: y position */
#define NODE_W(base, i) (NODE(base, i) + 16)  /* float: weight (degree) */
#define NODE_CR(base, i) (NODE(base, i) + 20) /* float: collision radius */

#define LINK(lbase, i) ((lbase) + (i) * 12)
#define LINK_SRC(lbase, i) (LINK(lbase, i) + 0)  /* int:   source node index */
#define LINK_DST(lbase, i) (LINK(lbase, i) + 4)  /* int:   target node index */
#define LINK_BIAS(lbase, i) (LINK(lbase, i) + 8) /* float: src_w / (src_w + dst_w) */

#define CTX_NODES_PTR(c) read_i32((c) + 0)  /* int:   nodes array base */
#define CTX_NODE_NEXT(c) read_i32((c) + 4)  /* int:   node_next[] base */
#define CTX_CELL_HEAD(c) read_i32((c) + 8)  /* int:   cell_head[] base */
#define CTX_HLEVEL(c) read_i32((c) + 12)    /* int:   recurse_level */
#define CTX_STRENGTH(c) read_f32((c) + 16)  /* float: repel_strength * alpha */
#define CTX_DIST2(c) read_f32((c) + 20)     /* float: theta^2 */
#define CTX_CSTRENGTH(c) read_f32((c) + 24) /* float: collision strength */
#define CTX_CRADIUS(c) read_f32((c) + 28)   /* float: max collision radius */

#define CELL(cells, i) ((cells) + (i) * 16)
#define CELL_CX(cells, i) (CELL(cells, i) + 0)  /* float: sum of x positions */
#define CELL_CY(cells, i) (CELL(cells, i) + 4)  /* float: sum of y positions */
#define CELL_CNT(cells, i) (CELL(cells, i) + 8) /* int:   node count */

#define BH_MIN_DIST2 30.0f // Minimum distance for Barnet-Hut approximation

/* Compute node degrees (weights) and per-link bias = src_w / (src_w + dst_w).
 * Bias distributes spring force proportionally: higher-degree nodes absorb less. */
void init(int nodes_base, int node_count, int link_count) {
  int link_base = nodes_base + node_count * 24;

  for (int i = 0; i < node_count; i++) {
    write_f32(NODE_W(nodes_base, i), 0.0f);
  }

  for (int i = 0; i < link_count; i++) {
    int src = read_i32(LINK_SRC(link_base, i));
    int dst = read_i32(LINK_DST(link_base, i));
    write_f32(NODE_W(nodes_base, src), read_f32(NODE_W(nodes_base, src)) + 1.0f);
    write_f32(NODE_W(nodes_base, dst), read_f32(NODE_W(nodes_base, dst)) + 1.0f);
  }

  for (int i = 0; i < link_count; i++) {
    int src = read_i32(LINK_SRC(link_base, i));
    int dst = read_i32(LINK_DST(link_base, i));
    float src_w = read_f32(NODE_W(nodes_base, src));
    float dst_w = read_f32(NODE_W(nodes_base, dst));
    write_f32(LINK_BIAS(link_base, i), src_w / (src_w + dst_w));
  }
}

void complete(int nodes_base, int node_count, float velocity_decay) {
  for (int i = 0; i < node_count; i++) {
    int np = NODE(nodes_base, i);
    float vx = read_f32(np + 8) * velocity_decay;
    float vy = read_f32(np + 12) * velocity_decay;
    write_f32(np + 8, vx);
    write_f32(np + 12, vy);
    write_f32(np + 0, read_f32(np + 0) + vx);
    write_f32(np + 4, read_f32(np + 4) + vy);
  }
}

/* Barnes-Hut traversal for repulsion: recurse into cells that are too close,
 * use aggregate mass for cells that are far enough (spread^2 < dist^2 * theta^2). */
void visitCharge(int ctx, int level, int cells, int node_ptr, int col, int row, float spread) {
  int cell_idx = col * level + row;
  int count = read_i32(CELL_CNT(cells, cell_idx));
  if (count == 0) {
    return;
  }

  float cell_cx = read_f32(CELL_CX(cells, cell_idx)) / (float)count;
  float cell_cy = read_f32(CELL_CY(cells, cell_idx)) / (float)count;
  float nx = read_f32(node_ptr + 0);
  float ny = read_f32(node_ptr + 4);
  float dx = cell_cx - nx;
  float dy = cell_cy - ny;
  float dist2_val = dx * dx + dy * dy;
  float theta2 = CTX_DIST2(ctx);
  int ctx_level = CTX_HLEVEL(ctx);

  if (spread * spread >= dist2_val * theta2) {
    if (ctx_level > level) {
      int child_level = level * 2;
      int child_cells = cells - child_level * child_level * 16;
      int child_col = col * 2;
      int child_row = row * 2;
      float child_spread = spread * 0.5f;

      if (read_i32(CELL_CNT(child_cells, child_col * child_level + child_row)) != 0) {
        visitCharge(ctx, child_level, child_cells, node_ptr, child_col, child_row, child_spread);
      }
      if (read_i32(CELL_CNT(child_cells, (child_col + 1) * child_level + child_row)) != 0) {
        visitCharge(ctx, child_level, child_cells, node_ptr, child_col + 1, child_row, child_spread);
      }
      if (read_i32(CELL_CNT(child_cells, child_col * child_level + child_row + 1)) != 0) {
        visitCharge(ctx, child_level, child_cells, node_ptr, child_col, child_row + 1, child_spread);
      }
      if (read_i32(CELL_CNT(child_cells, (child_col + 1) * child_level + child_row + 1)) != 0) {
        visitCharge(ctx, child_level, child_cells, node_ptr, child_col + 1, child_row + 1, child_spread);
      }

      return;
    }

    /* Leaf: exact pairwise repulsion */
    int nodes_base = CTX_NODES_PTR(ctx);
    int node_next = CTX_NODE_NEXT(ctx);
    float strength = CTX_STRENGTH(ctx);
    int curr_node = read_i32(CTX_CELL_HEAD(ctx) + cell_idx * 4);
    while (curr_node != -1) {
      int other = NODE(nodes_base, curr_node);
      if (other != node_ptr) {
        float odx = read_f32(other + 0) - nx;
        float ody = read_f32(other + 4) - ny;
        float d2 = odx * odx + ody * ody;
        if (d2 != 0.0f) {
          float force = strength / d2;
          write_f32(node_ptr + 8, read_f32(node_ptr + 8) + odx * force);
          write_f32(node_ptr + 12, read_f32(node_ptr + 12) + ody * force);
        }
      }
      curr_node = read_i32(node_next + curr_node * 4);
    }
    return;
  }

  /* Barnes-Hut approximation: use aggregate cell mass */
  if (dx == 0.0f) {
    dx = 0.5f;
  }
  if (dy == 0.0f) {
    dy = 0.5f;
  }
  float adjusted = dist2_val;
  if (dx == 0.5f) {
    adjusted += 0.25f;
  }
  if (dy == 0.5f) {
    adjusted += 0.25f;
  }
  if (adjusted < BH_MIN_DIST2) {
    adjusted = __builtin_sqrtf(adjusted * BH_MIN_DIST2);
  }
  float force = CTX_STRENGTH(ctx) * (float)count / adjusted;
  write_f32(node_ptr + 8, read_f32(node_ptr + 8) + dx * force);
  write_f32(node_ptr + 12, read_f32(node_ptr + 12) + dy * force);
}

/* Barnes-Hut traversal for collision: apply symmetric impulses to overlapping pairs. */
void visitCollide(int ctx, int level, int cells, int node_ptr, float node_px, float node_py, int col, int row, float x0,
                  float y0, float x1, float y1) {
  int cell_idx = col * level + row;
  if (read_i32(CELL_CNT(cells, cell_idx)) == 0) {
    return;
  }

  float c_strength = CTX_CSTRENGTH(ctx);
  float max_crad = CTX_CRADIUS(ctx);
  float node_crad = read_f32(node_ptr + 20);

  /* Cull cells whose bounding box can't overlap the node's collision radius. */
  float r = node_crad + max_crad;
  if (x1 < node_px - r || x0 > node_px + r || y1 < node_py - r || y0 > node_py + r) {
    return;
  }

  int ctx_level = CTX_HLEVEL(ctx);
  if (ctx_level > level) {
    int child_level = level * 2;
    int child_cells = cells - child_level * child_level * 16;
    int child_col = col * 2;
    int child_row = row * 2;
    float mx = (x0 + x1) * 0.5f;
    float my = (y0 + y1) * 0.5f;

    if (read_i32(CELL_CNT(child_cells, child_col * child_level + child_row)) != 0) {
      visitCollide(ctx, child_level, child_cells, node_ptr, node_px, node_py,
        child_col, child_row, x0, y0, mx, my);
    }
    if (read_i32(CELL_CNT(child_cells, (child_col + 1) * child_level + child_row)) != 0) {
      visitCollide(ctx, child_level, child_cells, node_ptr, node_px, node_py,
        child_col + 1, child_row, mx, y0, x1, my);
    }
    if (read_i32(CELL_CNT(child_cells, child_col * child_level + child_row + 1)) != 0) {
      visitCollide(ctx, child_level, child_cells, node_ptr, node_px, node_py,
        child_col, child_row + 1, x0, my, mx, y1);
    }
    if (read_i32(CELL_CNT(child_cells, (child_col + 1) * child_level + child_row + 1)) != 0) {
      visitCollide(ctx, child_level, child_cells, node_ptr, node_px, node_py,
        child_col + 1, child_row + 1, mx, my, x1, y1);
    }
    return;
  }

  /* Finest level — exact pairwise collision */
  int nodes_base = CTX_NODES_PTR(ctx);
  int node_next = CTX_NODE_NEXT(ctx);
  int curr = read_i32(CTX_CELL_HEAD(ctx) + cell_idx * 4);
  while (curr != -1) {
    int other = NODE(nodes_base, curr);
    if (other > node_ptr) {
      float other_crad = read_f32(other + 20);
      float pair_radius = node_crad + other_crad;
      float odx = node_px - read_f32(other + 0) - read_f32(other + 8);
      float ody = node_py - read_f32(other + 4) - read_f32(other + 12);
      float d2 = odx * odx + ody * ody;
      if (d2 > 0.0f && d2 < pair_radius * pair_radius) {
        float dist = __builtin_sqrtf(d2);
        float overlap = c_strength * (pair_radius - dist) / dist;
        float imp = overlap * 0.5f;
        float nvx_delta = odx * imp;
        float nvy_delta = ody * imp;
        write_f32(node_ptr + 8, read_f32(node_ptr + 8) + nvx_delta);
        write_f32(node_ptr + 12, read_f32(node_ptr + 12) + nvy_delta);
        write_f32(other + 8, read_f32(other + 8) - nvx_delta);
        write_f32(other + 12, read_f32(other + 12) - nvy_delta);
      }
    }
    curr = read_i32(node_next + curr * 4);
  }
}

/* Build Barnes-Hut spatial grid and apply many-body repulsion + collision. */
void manyBody(int nodes_base, int node_count, int link_count, float strength, float theta, float collision_str) {
  if (node_count < 2) {
    return;
  }

  int half_level = 1;
  while (half_level * half_level < node_count) {
    half_level *= 2;
  }
  int recurse_level = half_level >> 1;
  if (recurse_level < 1) {
    recurse_level = 1;
  }
  int cells_sq = recurse_level * recurse_level;

  int link_base = nodes_base + node_count * 24;
  int node_next = link_base + link_count * 12;
  int cell_head = node_next + node_count * 4;
  int ctx_base = cell_head + cells_sq * 4;
  int cells_base = ctx_base + 32;

  __builtin_memset((char *)node_next, 0xFF, node_count * 4);

  for (int ci = 0; ci < cells_sq; ci++) {
    write_i32(cell_head + ci * 4, -1);
    write_f32(CELL_CX(cells_base, ci), 0.0f);
    write_f32(CELL_CY(cells_base, ci), 0.0f);
    write_i32(CELL_CNT(cells_base, ci), 0);
    write_i32(CELL(cells_base, ci) + 12, 0);
  }

  float max_crad = read_f32(NODE_CR(nodes_base, 0));
  for (int i = 1; i < node_count; i++) {
    float cr = read_f32(NODE_CR(nodes_base, i));
    if (cr > max_crad) {
      max_crad = cr;
    }
  }

  write_i32(ctx_base + 0, nodes_base);
  write_i32(ctx_base + 4, node_next);
  write_i32(ctx_base + 8, cell_head);
  write_i32(ctx_base + 12, recurse_level);
  write_f32(ctx_base + 16, strength);
  write_f32(ctx_base + 20, theta * theta);
  write_f32(ctx_base + 24, collision_str);
  write_f32(ctx_base + 28, max_crad);

  float minX = read_f32(NODE_X(nodes_base, 0)), maxX = minX;
  float minY = read_f32(NODE_Y(nodes_base, 0)), maxY = minY;
  for (int i = 1; i < node_count; i++) {
    float xi = read_f32(NODE_X(nodes_base, i));
    float yi = read_f32(NODE_Y(nodes_base, i));
    if (xi > maxX) {
      maxX = xi;
    }
    if (xi < minX) {
      minX = xi;
    }
    if (yi > maxY) {
      maxY = yi;
    }
    if (yi < minY) {
      minY = yi;
    }
  }

  float xSpan = maxX - minX;
  float ySpan = maxY - minY;
  float cell_w = (xSpan == 0.0f) ? 1.0f : xSpan / (float)recurse_level;
  float cell_h = (ySpan == 0.0f) ? 1.0f : ySpan / (float)recurse_level;

  for (int i = node_count - 1; i >= 0; i--) {
    float nx = read_f32(NODE_X(nodes_base, i));
    float ny = read_f32(NODE_Y(nodes_base, i));
    int max_idx = recurse_level - 1;
    int col_idx = (int)__builtin_floorf((nx - minX) / cell_w);
    if (col_idx > max_idx) {
      col_idx = max_idx;
    }
    if (col_idx < 0) {
      col_idx = 0;
    }
    int row_idx = (int)__builtin_floorf((ny - minY) / cell_h);
    if (row_idx > max_idx) {
      row_idx = max_idx;
    }
    if (row_idx < 0) {
      row_idx = 0;
    }
    int ci = col_idx * recurse_level + row_idx;

    int old_head = read_i32(cell_head + ci * 4);
    write_i32(node_next + i * 4, old_head);
    write_i32(cell_head + ci * 4, i);
    write_f32(CELL_CX(cells_base, ci), read_f32(CELL_CX(cells_base, ci)) + nx);
    write_f32(CELL_CY(cells_base, ci), read_f32(CELL_CY(cells_base, ci)) + ny);
    write_i32(CELL_CNT(cells_base, ci), read_i32(CELL_CNT(cells_base, ci)) + 1);
  }

  int fine_level = recurse_level;
  int fine_cells = cells_base;
  while (fine_level >= 2) {
    int coarse_level = fine_level / 2;
    int coarse_cells = fine_cells + fine_level * fine_level * 16;
    for (int cj = 0; cj < coarse_level; cj++) {
      for (int ci = 0; ci < coarse_level; ci++) {
        int f00 = (ci * 2) * fine_level + (cj * 2);
        int f10 = (ci * 2 + 1) * fine_level + (cj * 2);
        int f01 = (ci * 2) * fine_level + (cj * 2 + 1);
        int f11 = (ci * 2 + 1) * fine_level + (cj * 2 + 1);
        int cc = ci * coarse_level + cj;
        write_i32(CELL_CNT(coarse_cells, cc),
                    read_i32(CELL_CNT(fine_cells, f00)) + read_i32(CELL_CNT(fine_cells, f10)) +
                    read_i32(CELL_CNT(fine_cells, f01)) + read_i32(CELL_CNT(fine_cells, f11)));
        write_f32(CELL_CX(coarse_cells, cc),
                    read_f32(CELL_CX(fine_cells, f00)) + read_f32(CELL_CX(fine_cells, f10)) +
                    read_f32(CELL_CX(fine_cells, f01)) + read_f32(CELL_CX(fine_cells, f11)));
        write_f32(CELL_CY(coarse_cells, cc),
                    read_f32(CELL_CY(fine_cells, f00)) + read_f32(CELL_CY(fine_cells, f10)) +
                    read_f32(CELL_CY(fine_cells, f01)) + read_f32(CELL_CY(fine_cells, f11)));
      }
    }
    fine_level = coarse_level;
    fine_cells = coarse_cells;
  }

  float spread = (xSpan > ySpan) ? xSpan : ySpan;
  for (int i = 0; i < node_count; i++) {
    visitCharge(ctx_base, fine_level, fine_cells, NODE(nodes_base, i), 0, 0, spread);
  }

  for (int i = 0; i < node_count; i++) {
    int np = NODE(nodes_base, i);
    visitCollide(ctx_base, fine_level, fine_cells, np,
        read_f32(np + 0) + read_f32(np + 8),
        read_f32(np + 4) + read_f32(np + 12),
        0, 0, minX, minY, maxX, maxY);
  }
}

/* One tick: apply center, link spring, and many-body forces to node velocities.
 * Follow with complete() to integrate velocities into positions. */
void simulate(int nodes_base, int node_count, int link_count, float alpha, float center_str, float link_str,
              float link_dist, float repel_str, float theta, float collision_str) {
  if (node_count < 1) {
    return;
  }

  int link_base = nodes_base + node_count * 24;

  float cf = alpha * center_str;
  for (int i = 0; i < node_count; i++) {
    int np = NODE(nodes_base, i);
    write_f32(np + 8, read_f32(np + 8) - cf * read_f32(np + 0));
    write_f32(np + 12, read_f32(np + 12) - cf * read_f32(np + 4));
  }

  float alpha_link = alpha * link_str;
  for (int i = 0; i < link_count; i++) {
    int lp = LINK(link_base, i);
    int s = NODE(nodes_base, read_i32(lp + 0));
    int t = NODE(nodes_base, read_i32(lp + 4));
    float bias = read_f32(lp + 8);

    float dx = (read_f32(t + 0) + read_f32(t + 8)) - (read_f32(s + 0) + read_f32(s + 8));
    if (dx == 0.0f) {
      dx = 0.1f; /* jitter avoids division by zero */
    }
    float dy = (read_f32(t + 4) + read_f32(t + 12)) - (read_f32(s + 4) + read_f32(s + 12));
    if (dy == 0.0f) {
      dy = 0.1f;
    }

    float dist = __builtin_sqrtf(dx * dx + dy * dy);
    float src_w = read_f32(s + 16);
    float dst_w = read_f32(t + 16);
    float min_w = (src_w < dst_w) ? src_w : dst_w;
    float l = (dist - link_dist) / dist * alpha_link / min_w;
    float one_minus_bias = 1.0f - bias;

    write_f32(t + 8, read_f32(t + 8) - dx * l * bias);
    write_f32(t + 12, read_f32(t + 12) - dy * l * bias);
    write_f32(s + 8, read_f32(s + 8) + dx * l * one_minus_bias);
    write_f32(s + 12, read_f32(s + 12) + dy * l * one_minus_bias);
  }

  manyBody(nodes_base, node_count, link_count, alpha * repel_str, theta, collision_str);
}
