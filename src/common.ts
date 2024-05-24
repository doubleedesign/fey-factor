import { WriteStream } from 'fs';
import { Database } from './database/database';

export const db = new Database();

export const COMEDY_GENRE_ID = 35; // themoviedb.org genre id
export const EXCLUDED_GENRE_IDS = [10767, 16, 10762, 10763, 99]; // talk shows, animation, kids, news, documentary

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

