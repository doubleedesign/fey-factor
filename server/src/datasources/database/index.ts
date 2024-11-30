import pg from 'pg';
import { DbConnectionEntities } from './connections';
import { DbWorks } from './works';
import { DbPeople } from './people';
import { DbRoles } from './roles';
import { DbNetwork } from './network';
import { DbVenn } from './venn';

const baseConfig = {
	// Can use 'localhost' if using WSL1, but this will not work on WSL2 - need to do some IP magic.
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'root'
};

// Base class for the connection
export class BaseConnection {
	dbName: string = 'feyfactor';
	pgClient: pg.Pool;

	constructor() {
		this.pgClient = new pg.Pool({
			...baseConfig, // Ensure baseConfig is defined or imported
			database: this.dbName
		});
	}
}

// Composition class to allow for separation of methods into different files
export class DatabaseConnection extends BaseConnection {
	connections: DbConnectionEntities;
	works: DbWorks;
	people: DbPeople;
	roles: DbRoles;
	network: DbNetwork;
	venn: DbVenn;

	constructor() {
		super();
		this.connections = new DbConnectionEntities(this.pgClient);
		this.works = new DbWorks(this.pgClient);
		this.people = new DbPeople(this.pgClient);
		this.roles = new DbRoles(this.pgClient);
		this.network = new DbNetwork(this.pgClient);
		this.venn = new DbVenn(this.pgClient);
	}

	/**
	 * For my made-up concept of a "glue key":
	 * In a table with a set of 3 foreign keys, the "glue key" is the one that is relevant to "sticking" the other keys together to form relevant information.
	 * The glue key is set by using an index connecting those keys, with the "glue" as the last one.
	 * This method retrieves the name of the glue key for a given table, if there is one.
	 * @param tableName
	 */
	async getGlueKey(tableName: string): Promise<string | boolean> {
		try {
			const response = await this.pgClient.query(`
                SELECT a.attname AS column_name
                FROM pg_class t,
                     pg_class i,
                     pg_index ix,
                     pg_attribute a
                WHERE t.oid = ix.indrelid
                  AND i.oid = ix.indexrelid
                  AND a.attrelid = t.oid
                  AND a.attnum = ANY (ix.indkey)
                  AND t.relkind = 'r'
                  AND i.relname = 'idx_${tableName}_glue_key'
                ORDER BY array_position(ix.indkey, a.attnum);
			`);

			return response.rows.reverse()[0].column_name;
		}
		catch (error) {
			return false;
		}
	}
}
