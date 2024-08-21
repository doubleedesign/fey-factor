export default {
	testEnvironment: 'node',
	rootDir: './src',
	transform: {
		'^.+\\.(ts|tsx)?$':  ['babel-jest', {
			presets: [
				['@babel/preset-env', { targets: { node: 'current' } }],
				'@babel/preset-typescript',
			],
			plugins: []
		}],
	},
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
};