import { wait } from '../../common.ts';
import chalk from 'chalk';

type Message = {
	message: string;
	persistent: boolean;
}

type QueueOptions = {
	verbose: boolean;
	speed: number;
}

export class CustomConsole {
	messageQueue: Message[];
	isProcessing: boolean;

	constructor() {
		this.messageQueue = [];
		this.isProcessing = false;
	}

	/**
	 * Process the message queue
	 * @param verbose - Whether to process in real time or synchronously.
	 *                  True (verbose) ignores persistent/transient status and the speed setting,
	 *                  and logs everything as it happens.
	 * @param speed - For non-verbose, or "pretty" human-watching-it mode, the speed at which to display and erase transient messages.
	 */
	async processQueue({ verbose, speed = 500 }) {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.messageQueue.length > 0) {
			const { message, persistent } = this.messageQueue.shift();

			if(!verbose) {
				if (persistent) {
					await wait(speed + 100); // Make sure prior transient messages have cleared first
					process.stdout.write(message + '\n');
				}
				else {
					process.stdout.write(message);
					await wait(speed); // Display time
					process.stdout.cursorTo(0);
					process.stdout.clearLine(0);
				}
			}
			else {
				console.log(message);
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

	// Go up a line and clear it
	// Can be used to clear persistent messages after a section is done
	async clearPreviousLine() {
		await wait(600); // Wait for the last message to display or disappear
		process.stdout.moveCursor(0, -1);
		process.stdout.clearLine(0);
		process.stdout.moveCursor(0, -1);
	}

	info(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.cyanBright(message))
			: this.logTransient(chalk.cyanBright(message));
	}

	announce(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.magenta(message))
			: this.logTransient(chalk.magenta(message));
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

	warn(message: string, persistent: boolean = true) {
		return persistent
			? this.logPersistent(chalk.yellow(message))
			: this.logTransient(chalk.yellow(message));
	}
}
