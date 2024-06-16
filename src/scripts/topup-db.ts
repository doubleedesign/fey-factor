import { db } from '../common.ts';
import { PopulationScriptSettings } from './types.ts';
import { DataPopulatorCommon } from './DataPopulatorCommon.ts';

class Topper extends DataPopulatorCommon {

	constructor(settings: PopulationScriptSettings) {
		super(settings);
	}

	async run() {
		await super.setup();

	}
}

export function topupDb({ count, ...settings }: PopulationScriptSettings & { count: number }) {

}
