import { promises as fs, WriteStream } from 'fs';
// noinspection ES6PreferShortImport
import { DatabaseConnection } from './database/index.ts';
// noinspection ES6PreferShortImport
import { CustomConsole } from './utils/CustomConsole/index.ts';
import * as path from 'node:path';

export const db = new DatabaseConnection();
export const customConsole = new CustomConsole();

export const COMEDY_GENRE_ID = 35; // themoviedb.org genre id
export const EXCLUDED_GENRE_IDS = [
	10767, // talk shows
	16, // animation
	10762, // kids
	10751, // family
	10763, // news
	99, // documentary
	10764, // reality
	10759, // action/adventure TV
	28, // action film
];

export const START_YEAR = new Date().getFullYear() - 20;

export function convertIdToInteger(id: string) {
	return parseInt(id.replace('_T', '').replace('_F', ''));
}

export function convertIdToString(id: number | string, type: 'T' | 'F') {
	// Sometimes pre-suffixed IDs are making it to the db functions that expect a number without TypeScript picking it up
	if(id.toString().endsWith('_T') || id.toString().endsWith('_F')) {
		return id.toString();
	}

	return `${id}_${type}`;
}

export function logToFile(logFile: WriteStream, message: string) {
	logFile.write(`${new Date().toLocaleString('en-AU', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})}\t ${message}\n`);
}

export function wait(time:number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function createFileIfNotExists(filePath: string) {
	try {
		// Ensure the directory exists
		const directory = path.dirname(filePath);
		await fs.mkdir(directory, { recursive: true });

		// Check if file exists
		await fs.access(filePath);
		console.log(`File ${filePath} exists.`);
	}
	catch (error) {
		if (error.code === 'ENOENT') {
			try {
				// Create the file
				await fs.writeFile(filePath, '');
				console.log(`File ${filePath} created successfully.`);
			}
			catch (writeError) {
				console.error(`Error creating file: ${writeError.message}`);
			}
		}
		else {
			console.error(`Error checking file: ${error.message}`);
		}
	}
}