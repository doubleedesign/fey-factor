import { wait } from '../../common.ts';
import chalk from 'chalk';
import cliProgress from 'cli-progress';

type Message = {
	message: string;
	persistent: boolean;
}

export enum LoggingType {
	VERBOSE = 'verbose',
	PRETTY = 'pretty',
	PROGRESS = 'progress'
}

type QueueOptions = {
	style: LoggingType;
	speed: number;
}

export class CustomConsole {
	messageQueue: Message[];
	isProcessing: boolean;
	speed: number;
	style: LoggingType;
	multiBar: cliProgress.MultiBar;
	progressBars: { [key: string]: cliProgress.SingleBar };

	/**
	 * Create a new CustomConsole instance.
	 * @param style - Verbose: ignores persistent/transient status and the speed setting, and logs everything as it happens.
	 *                Pretty: logs most messages in a transient manner, designed to give a human-readable general idea of progress.
	 *                Progress: displays progress bars and ignores standard messages. Only logs messages when logProgress() is used.
	 * @param speed - For "pretty" mode, the speed at which to display and erase transient messages.
	 */
	constructor({ speed, style }: QueueOptions) {
		this.messageQueue = [];
		this.isProcessing = false;
		this.speed = speed;
		this.style = style;

		this.progressBars = {};
		this.multiBar = new cliProgress.MultiBar({
			clearOnComplete: false,
			hideCursor: true,
			format: '{bar} {label}\t | {percentage}% | {value}/{total} \t| {duration}s'
		}, cliProgress.Presets.shades_classic);
	}

	async processQueue() {
		if (this.style === LoggingType.PROGRESS) return; // Progress bars are handled separately
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.messageQueue.length > 0) {
			const { message, persistent } = this.messageQueue.shift() as Message;

			if(this.style === LoggingType.PRETTY) {
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
			else if(this.style === 'verbose') {
				console.log(message);
			}
		}

		this.isProcessing = false;
	}

	async waitForQueue() {
		if(this.messageQueue.length > 0 && this.style !== LoggingType.PROGRESS) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(this.processQueue());
				}, this.messageQueue.length * this.speed);
			});
		}

		return new Promise<void>(resolve => resolve());
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

	addProgressBar(name: string, total: number = 100) {
		if(this.style !== LoggingType.PROGRESS) return;

		if (this.progressBars[name]) {
			throw new Error(`Progress bar with name '${name}' already exists.`);
		}
		this.progressBars[name] = this.multiBar.create(total, 0, {
			label: chalk.magentaBright(name),
			clearOnComplete: true
		});
	}

	updateProgress(name: string, value: number) {
		if(this.style !== LoggingType.PROGRESS) return;

		if (this.progressBars[name]) {
			this.progressBars[name].update(value);
		}
	}

	logProgress(message: string) {
		if(this.style !== LoggingType.PROGRESS) return;

		this.multiBar.log(chalk.green(`${message}\n`));
	}

	stopProgressBar(name: string) {
		if(this.style !== LoggingType.PROGRESS) return;

		if (this.progressBars[name]) {
			this.progressBars[name].stop();
			delete this.progressBars[name];
		}
	}

	stopAllProgressBars() {
		if(this.style !== LoggingType.PROGRESS) return;

		this.multiBar.stop();
	}

	clearConsole() {
		process.stdout.write('\x1Bc');
	}
}
