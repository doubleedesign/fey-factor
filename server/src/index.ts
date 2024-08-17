import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import gql from 'graphql-tag';
import PersonResolvers from './resolvers/person';

const schema = createSchema({
	typeDefs: gql`
		type Query {
            person(id: ID!): Person
		}
		${readFileSync('./src/generated/typeDefs.graphql', 'utf8')}
	`,
	resolvers: {
		Query: {
			...PersonResolvers.Query
		},
	},
});

// Create the Yoga server
const yoga = createYoga({ schema });

// Create an HTTP server and attach the Yoga server to it
const server = createServer(yoga);

server.listen(4000, () => {
	const url = 'http://localhost:4000/graphql';

	console.log(chalk.magenta('==================================================================='));
	console.log(chalk.cyan(`GraphQL Yoga server is running at ${url}`));
	console.log(chalk.magenta('==================================================================='));

	// Automatically open the default browser
	exec(`explorer.exe ${url.replace(/&/g, '^&')}`);
});
