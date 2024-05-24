const esModules = ['@doubleedesign/type-checker'].join('|');

export default {
	testEnvironment: 'node',
	rootDir: './',
	setupFiles: ['./jest.setup.ts'],
	transform: {
		'^.+\\.(ts|tsx)?$': ['ts-jest', {
			isolatedModules: true,
			tsconfig: './tsconfig.json'
		}],
	},
	transformIgnorePatterns: [`./node_modules/(?!${esModules})`],
	moduleNameMapper: {
		'^@doubleedesign/type-checker$': '<rootDir>/node_modules/@doubleedesign/type-checker/index.ts'
	}
};
