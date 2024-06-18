import chalk from 'chalk';
import { db } from '../common.ts';

export async function resetDb() {
	try {
		const dbExists = await db.databaseExists();
		if(!dbExists) {
			console.log(chalk.red('Database does not exist.'));
			process.exit(1);
		}

		await db.forceDropDatabase();
		console.log(chalk.green('Database dropped.'));
	}
	catch(error) {
		console.log(chalk.red(error.message));
	}
}
