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
	speed: number;
	verbose: boolean;

	constructor({ speed, verbose }: QueueOptions) {
		this.messageQueue = [];
		this.isProcessing = false;
		this.speed = speed;
		this.verbose = verbose;
	}

	/**
	 * Process the message queue
	 * @param verbose - Whether to process in real time or synchronously.
	 *                  True (verbose) ignores persistent/transient status and the speed setting,
	 *                  and logs everything as it happens.
	 * @param speed - For non-verbose, or "pretty" human-watching-it mode, the speed at which to display and erase transient messages.
	 */
	async processQueue() {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.messageQueue.length > 0) {
			const { message, persistent } = this.messageQueue.shift();

			if(!this.verbose) {
				if (persistent) {
					await wait(this.speed + 100); // Make sure prior transient messages have cleared first
					process.stdout.write(message + '\n');
				}
				else {
					process.stdout.write(message);
					await wait(this.speed); // Display time
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
	clearPreviousLine() {
		wait(this.speed).then(() => {
			process.stdout.clearLine(0); // ensure this line is cleared first
			process.stdout.moveCursor(0, -1); // move up a line
			process.stdout.clearLine(0); // clear that line
		});
	}

	info(message: string, persistent: boolean = false) {
		return persistent
			? this.logPersistent(chalk.cyanBright(message))
			: this.logTransient(chalk.cyanBright(message));
	}

	announce(message: string, persistent: boolean = false) {
		return persistent
			// eslint-disable-next-line max-len
			? this.logPersistent(`===============================================\n${chalk.magenta(message)}\n===============================================`)
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
