import fs from 'node:fs';
import path from 'node:path';

// FIXME: The filename passed in here might be slugified, the only way seems to also slugify the names of the files in the directory
export async function fileExists(directory: string, fileName: string): Promise<string | null> {
	try {
		if (!fs.existsSync(directory)) {
			return Promise.resolve(null);
		}
		const files = await fs.promises.readdir(directory);
		const file = files.find(file_1 => file_1.startsWith(fileName));
		return file ? path.join(directory, file) : null;
	} catch (e) {
		return Promise.resolve(null);
	}
}

export async function* walk(dir: string): AsyncGenerator<string> {
	for await (const d of await fs.promises.opendir(dir)) {
		const entry = path.join(dir, d.name);
		if (d.isDirectory()) yield* walk(entry);
		else if (d.isFile()) yield entry;
	}
}
