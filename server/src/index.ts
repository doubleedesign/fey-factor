import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import chalk from 'chalk';
import resolvers from './resolvers';
import { exec } from 'child_process';

const schema = createSchema({
	typeDefs: gql`
        ${readFileSync('./src/generated/queryType.graphql', 'utf8')}
        ${readFileSync('./src/generated/typeDefs.graphql', 'utf8')}
	`,
	resolvers: resolvers
});

// Create the Yoga server
const yoga = createYoga({ schema });

// Create an HTTP server and attach the Yoga server to it
const server = createServer(yoga);

// Start the server
server.listen(4000, () => {
	const url = 'http://localhost:4000/graphql';

	console.log(chalk.magenta('==================================================================='));
	console.log(chalk.cyan(`GraphQL Yoga server is running at ${url}`));
	console.log(chalk.magenta('==================================================================='));

	// Automatically open the default browser
	//exec(`explorer.exe ${url.replace(/&/g, '^&')}`);
});
