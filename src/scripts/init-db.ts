import chalk from 'chalk';
import { db } from '../common.ts';

export async function initDb() {
	db.createDatabase().then(() => {
		db.testPostgresConnection().then(async (connected: boolean) => {
			if (connected) {
				await db.createTables();
				await db.createWorkType('film');
				await db.createWorkType('television');
				await db.createRole('cast');
				await db.createRole('recurring_cast');
				await db.createRole('guest_cast');
				await db.createRole('creator');
				await db.createRole('writer');
				await db.createRole('director');
				await db.createRole('executive_producer');
				await db.createRole('co-executive_producer');
				await db.createRole('producer');
				await db.createRole('co_producer');
				await db.createRole('supervising_producer');
				await db.createRole('associate_producer');
				await db.createRole('composer');
				await db.createRole('story_editor');
				await db.createRole('executive_story_editor');
			}
			else {
				throw new Error('Could not connect to database');
			}
		}).catch((error: Error) => {
			console.log(chalk.red(error));
		});
	}).catch((error: Error) => {
		console.log(chalk.red(error));
	});
}

try {
	await initDb();
}
catch(error) {
	console.log(chalk.red(error));
}
