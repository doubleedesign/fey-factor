import chalk from 'chalk';
import { db } from '../common.ts';

try {
	const dbExists = await db.databaseExists();
	if(!dbExists) {
		console.log(chalk.red('Database does not exist. Perhaps you want to run "npm run init-db"?'));
		process.exit(1);
	}

	await db.forceDropDatabase();
	console.log(chalk.green('Database dropped. Run "npm run init-db" to continue.'));
	process.exit(0);
}
catch(error) {
	console.log(chalk.red(error.message));
}
