import { z } from 'astro/zod';
import { AstroError } from 'astro/errors';

export const graphConfigSchema = z.object({
	graph: z
		.object({
			hidden: z.boolean().optional(),
			depth: z.number().optional(),
			exclude: z.boolean().default(false),
		})
		.default({
			exclude: false,
		}),
});

interface SchemaContext {
	// image: ImageFunction
}

export function graphSchema(context: SchemaContext) {
	// Checking for `context` to provide a better migration error message.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!context) {
		throw new AstroError(
			'Missing graph config schema validation context.',
			`You may need to update your content collections configuration in the \`src/content/config.ts\` file and pass the context to the \`graphSchema\` function:

\`docs: defineCollection({ schema: docsSchema({ extend: (context) => graphSchema(context) }) })\`

If you believe this is a bug, please file an issue at https://github.com/Fevol/starlight-site-graph/issues/new`,
		);
	}

	return graphConfigSchema;
}
