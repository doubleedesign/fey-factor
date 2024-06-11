import { WriteStream } from 'fs';
import { Database } from './database/database.ts';
import { CustomConsole } from './utils/CustomConsole/CustomConsole.ts';

export const db = new Database();
export const customConsole = new CustomConsole();

export const COMEDY_GENRE_ID = 35; // themoviedb.org genre id
export const EXCLUDED_GENRE_IDS = [10767, 16, 10762, 10763, 99, 10764]; // talk shows, animation, kids, news, documentary, reality

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
