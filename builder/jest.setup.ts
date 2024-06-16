import * as dotenv from 'dotenv';
dotenv.config();

jest.mock('chalk', () => ({
	green: jest.fn().mockImplementation((message: string) => {
		console.log(message);
	}),
	red: jest.fn().mockImplementation((message: string) => {
		console.log(message);
	})
}));

