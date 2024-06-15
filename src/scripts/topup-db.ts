import { DataPopulator, DataPopulatorInterface } from './DataPopulator.ts';
import { db } from '../common.ts';

class Topper extends DataPopulator implements DataPopulatorInterface {

	constructor() {
		super();
	}

	async run() {
		super.runMessageQueue();
	}
}

export function topupDb({ count }) {

}
