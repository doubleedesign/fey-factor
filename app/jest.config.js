import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	testEnvironment: 'node',
	rootDir: './',
	transform: {
		'^.+\\.(ts|tsx)?$': ['ts-jest', {
			isolatedModules: true,
			tsconfig: path.resolve(__dirname, './tsconfig.app.json')
		}],
	},
};
