import chalk from 'chalk';
import { db, wait } from '../common.ts';

export async function initDb() {
	db.createDatabase().then(() => {
		db.createTables().then(async() => {
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
		});
	});
}

try {
	await initDb();
}
catch(error) {
	console.log(chalk.red(error.message));
}
