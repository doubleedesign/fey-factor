import { customConsole, db } from '../common.ts';
import { PopulationScriptSettings } from './types.ts';
import { DataPopulatorCommon } from './DataPopulatorCommon.ts';

class TvTopper extends DataPopulatorCommon {
	count: number;

	constructor({ count, ...settings }: PopulationScriptSettings & { count: number }) {
		super(settings);
		this.count = count;
	}

	async run() {
		await super.setup();

		// TODO: Remember what I was going to do with this and do it
	}
}

export function topupDb({ count, ...settings }: PopulationScriptSettings & { count: number }) {
	new TvTopper({ count, ...settings }).run().then(() => {
		customConsole.stopAllProgressBars();
		customConsole.logProgress('TV show top-up complete.');
		customConsole.success('TV show top-up complete.', true);
	});
}
