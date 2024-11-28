import chalk from 'chalk';

export class CustomConsole {
	constructor() {
	}

	info(message: string) {
		console.log(chalk.cyanBright(message));
	}

	announce(message: string) {
		console.log(chalk.magenta(message));
	}

	success(message: string) {
		console.log(chalk.green(message));
	}

	error(message: string)  {
		console.log(chalk.red(message));
	}

	warn(message: string) {
		console.log(chalk.yellow(message));
	}
}
