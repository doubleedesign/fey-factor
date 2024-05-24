/*
 * Chalk causes errors in tests because of its use of require()
 * and it doesn't need to be actually called in tests anyway
 */
jest.mock('chalk', () => ({
	green: jest.fn(),
	red: jest.fn()
}));
