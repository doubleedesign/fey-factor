import chalk from 'chalk';
import { db } from '../common.ts';
import { initDb } from './init-db.ts';

try {
	await db.dropDatabase();
	await initDb();
}
catch(error) {
	console.log(chalk.red(error));
}