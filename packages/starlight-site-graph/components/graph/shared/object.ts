export function isObject(item: unknown): item is Record<string, unknown> {
	return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export type DiffValue<V> = { oldValue: V; newValue: V };
export type DeepDiffResult<T> = {
	[K in keyof T]?: T[K] extends Record<string, unknown>
		? DeepDiffResult<T[K]> | DiffValue<T[K]>
		: DiffValue<T[K]>;
};

function deepEqualArray(a: unknown[], b: unknown[]): boolean {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		const left = a[i];
		const right = b[i];

		if (Array.isArray(left) && Array.isArray(right)) {
			if (!deepEqualArray(left, right)) {
				return false;
			} else {
				continue;
			}
		}

		if (isObject(left) && isObject(right)) {
			if (Object.keys(deepDiff(left, right)).length > 0) {
				return false;
			} else {
				continue;
			}
		}

		if (left !== right) {
			return false;
		}
	}

	return true;
}

export function deepDiff<T extends Record<string, unknown>>(obj1: T, obj2: T): DeepDiffResult<T> {
	const changes: Partial<Record<keyof T, unknown>> = {};
	const allKeys = Object.keys({ ...obj1, ...obj2 }) as (keyof T)[];

	for (const key of allKeys) {
		const val1 = obj1[key];
		const val2 = obj2[key];

		if (Array.isArray(val1) && Array.isArray(val2)) {
			if (!deepEqualArray(val1, val2)) {
				changes[key] = { oldValue: val1, newValue: val2 };
			}
		} else if (isObject(val1) && isObject(val2)) {
			const nested = deepDiff(val1 as Record<string, unknown>, val2 as Record<string, unknown>);
			if (Object.keys(nested).length > 0) {
				changes[key] = nested;
			}
		} else if (val1 !== val2) {
			changes[key] = { oldValue: val1, newValue: val2 };
		}
	}

	return changes as DeepDiffResult<T>;
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Record<string, unknown>
		? DeepPartial<T[P]> | undefined
		: T[P] | undefined;
};

export function mergeDefaults<T extends Record<string, unknown>>(base: T, patch: DeepPartial<T>): T {
	const result: Record<string, unknown> = { ...base };
	const allKeys = new Set([...Object.keys(base), ...Object.keys(patch as object)]);

	for (const key of allKeys) {
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
			continue;
		}

		const baseValue = result[key];
		const patchValue = patch[key as keyof typeof patch];

		if (isObject(patchValue) && isObject(baseValue)) {
			result[key] = mergeDefaults(baseValue, patchValue as DeepPartial<Record<string, unknown>>);
		} else if (patchValue !== undefined) {
			result[key] = patchValue;
		}
	}

	return result as T;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function ensureRecord(target: Record<string, unknown>, key: string) {
	const current = target[key];
	if (isRecord(current)) {
		return current;
	} else {
		const next: Record<string, unknown> = {};
		target[key] = next;
		return next;
	}
}
