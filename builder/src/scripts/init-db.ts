import { db } from '../common.ts';

export async function initDb() {
	await db.createDatabase();
	await db.createTables();
	await db.createRole('cast'); // TODO Differentiate between main, recurring, and guest cast roles?
	// Common crew roles
	await db.createRole('writer');
	await db.createRole('director');
	await db.createRole('executive_producer');
	await db.createRole('co-executive_producer');
	await db.createRole('producer');
	await db.createRole('co_producer');
	await db.createRole('associate_producer');
	// TV show crew roles
	await db.createRole('creator');
	await db.createRole('supervising_producer');
	await db.createRole('composer');
	await db.createRole('story_editor');
	await db.createRole('executive_story_editor');
	// Film crew roles
	// Ref: Mostly creative development roles as per https://blog.assemble.tv/the-definitive-film-crew-hierarchy-chart
	await db.createRole('screenplay');
	await db.createRole('screenwriter');
	await db.createRole('director_of_photography');
	// film crew roles not "above the line" in the above ref article, but seem relevant to what I'm doing here
	await db.createRole('casting');
	await db.createRole('casting_director');
	await db.createRole('original_music_composer');
	await db.createRole('art_direction');
}
