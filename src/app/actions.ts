'use server';

import {promises as fs} from 'fs';

export async function readFile(path: any) {
	if (process.env.NODE_ENV === 'production') {
		const file = await fs.readFile(process.cwd() + '/.next/server' + path, 'utf8');
		return JSON.parse(file);
	}

	const file = await fs.readFile(process.cwd() + path, 'utf8');
	return JSON.parse(file);
}
