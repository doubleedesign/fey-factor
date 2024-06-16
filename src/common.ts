import { WriteStream } from 'fs';
import { DatabaseConnection } from './database/DatabaseConnection.ts';
import { CustomConsole } from './utils/CustomConsole/CustomConsole.ts';

export const db = new DatabaseConnection();
export const customConsole = new CustomConsole({ verbose: false, speed: 50 });

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
