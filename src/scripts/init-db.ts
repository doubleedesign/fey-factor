import { db } from '../common.ts';

export async function initDb() {
	await db.createDatabase();
	await db.createTables();
	await db.createRole('cast');
	// TODO Differentiate between main, recurring, and guest cast roles
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
