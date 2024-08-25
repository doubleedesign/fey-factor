import pg from 'pg';
import { DbConnectionEntities } from './connections';
import { DbWorks } from './works';
import { DbPeople } from './people';
import { DbRoles } from './roles';

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

	constructor() {
		super();
		this.connections = new DbConnectionEntities(this.pgClient);
		this.works = new DbWorks(this.pgClient);
		this.people = new DbPeople(this.pgClient);
		this.roles = new DbRoles(this.pgClient);
	}
}