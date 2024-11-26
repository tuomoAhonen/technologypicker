'use server';

import {promises as fs} from 'fs';

export async function readFile(path: any) {
	const file = await fs.readFile(path, 'utf8');
	return JSON.parse(file);
}
