import { pathToFileURL } from 'node:url';
import { register } from 'node:module';

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	console.log(error.stack);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection:', promise);
	console.log(reason);
	process.exit(1);
});

register('ts-node/esm', pathToFileURL('./'));
