import { wait } from '../../common.ts';
import chalk from 'chalk';

type Message = {
	message: string;
	persistent: boolean;
}

export class CustomConsole {
	messageQueue: Message[];
	isProcessing: boolean;

	constructor() {
		this.messageQueue = [];
		this.isProcessing = false;
	}

	processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.messageQueue.length > 0) {
			const { message, persistent } = this.messageQueue.shift();

			if (persistent) {
				process.stdout.write('\n' + message + '\n');
			}
			else {
				process.stdout.write(message);
				wait(1000).then(() => {
					process.stdout.cursorTo(0);
					process.stdout.clearLine(0);
				});
			}
		}

		this.isProcessing = false;
	}

	logTransient(message: string) {
		this.messageQueue.push({ message, persistent: false });
	}

	logPersistent(message: string) {
		this.messageQueue.push({ message, persistent: true });
	}

	info(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.cyanBright(message))
			: this.logTransient(chalk.cyanBright(message));
	}

	success(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.green(message))
			: this.logTransient(chalk.green(message));
	}

	error(message: string, persistent: boolean = true)  {
		return persistent
			? this.logPersistent(chalk.red(message))
			: this.logTransient(chalk.red(message));
	}

	warn(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.yellow(message))
			: this.logTransient(chalk.yellow(message));
	}
}
