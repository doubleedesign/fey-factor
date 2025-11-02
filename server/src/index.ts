import { createYoga, createSchema } from 'graphql-yoga';
import { GraphQLError } from 'graphql';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import chalk from 'chalk';
import resolvers from './resolvers';

const schema = createSchema({
	typeDefs: gql`
        ${readFileSync('./src/generated/queryType.graphql', 'utf8')}
        ${readFileSync('./src/generated/typeDefs.graphql', 'utf8')}
	`,
	resolvers: resolvers
});

// Create the Yoga server
const yoga = createYoga({
	schema,
	plugins: [
		{
			onExecute({ args, context }) {
				return {
					onExecuteDone(event) {
						if (event.result.errors) {
							event.result.errors = event.result.errors.map(error => {
								const exclude = ['at process.processTicksAndRejections', 'node_modules\\pg-pool\\index.js'];
								const excludeStartingWith = ['at async Promise.all (index 0)', 'at async promiseForObject'];
								const stackLines = error.stack.split(/\r\n|\r|\n/).map(line => line.trim()).filter(line => {
									return !exclude.some(excludedPhrase => line.includes(excludedPhrase))
										&& !line.startsWith('error:')
										&& !line.startsWith('at async file:')
										&& !excludeStartingWith.some(thing => line.startsWith(thing));
								});

								console.log(stackLines);

								return new GraphQLError(error.message, {
									path: error.path,
									extensions: {
										stack: stackLines.map(line => {
											const location = line.match(/\((.*):(\d+):(\d+)\)$/g);

											return ({
												function: line.replace('at async', '').split(' (')[0].trim(),
												location: location[0]?.split('fey-factor')?.[1]?.replaceAll('\\', '/') ?? undefined
											});
										}),
										code: 'CUSTOM_ERROR_HANDLER',
									}
								});
							});
						}
					}
				};
			}
		}
	],
});

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
