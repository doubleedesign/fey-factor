import { onTrack } from '../datasources/onTrack.ts';
import { datawranglers } from './index.ts';
import * as constants from '../constants.ts';
import _ from 'lodash';

describe('sorting', () => {
	let rawData = [];
	const usernameSpy = jest.spyOn(constants, 'getUsername');
	const tokenSpy = jest.spyOn(constants, 'getAuthToken');

	// Arrange
	// Note: This needs to be beforeEach not beforeAll to ensure the raw data resets to its initial state for each test
	beforeEach(async () => {
		usernameSpy.mockReturnValue('valid-username');
		tokenSpy.mockReturnValue('valid-token');
		rawData = await onTrack.fetchTaskRowsForProjects([57972, 25781, 77057, 24488]);
	});

	it('sorts by due date by default', () => {
		expect(rawData[0].due_date).toEqual('2024-03-11');
		expect(rawData[38].due_date).toEqual('2024-05-06');
	});

	it('sorts by due date ascending', () => {
		// Act
		const result = datawranglers.sort(rawData, 'due_date', 'asc');

		// Assert
		expect(result).toHaveLength(39);
		expect(result[0].due_date).toEqual('2024-03-11');
		expect(result[38].due_date).toEqual('2024-05-06');

		// BI[C]EP - Cross-check using lodash library
		expect(result).toEqual(_.orderBy(rawData, ['due_date'], ['asc']));
	});

	it('sorts by due date descending', () => {
		// Act
		const result = datawranglers.sort(rawData, 'due_date', 'desc');

		// Assert
		expect(result).toHaveLength(39);
		expect(result[0].due_date).toEqual('2024-05-06');
		expect(result[38].due_date).toEqual('2024-03-11');

		// BI[C]EP - Cross-check using lodash library
		expect(result).toEqual(_.orderBy(rawData, ['due_date'], ['desc']));
	});

	it('sorts by target grade ascending', () => {
		const result = datawranglers.sort(rawData, 'taskTargetGrade', 'asc');

		expect(result[0].taskTargetGrade).toEqual(0);
		expect(result[38].taskTargetGrade).toEqual(3);

		expect(result).toEqual(_.sortBy(rawData, 'taskTargetGrade'));
	});

	it('sorts by target grade descending', () => {
		const result = datawranglers.sort(rawData, 'taskTargetGrade', 'desc');

		expect(result[0].taskTargetGrade).toEqual(3);
		expect(result[38].taskTargetGrade).toEqual(0);

		expect(result).toEqual(_.orderBy(rawData, ['taskTargetGrade'], ['desc']));
	});

	it('sorts by status ascending', () => {
		const result = datawranglers.sort(rawData, 'status', 'asc');

		expect(result[0].status).toEqual('complete');
		expect(result[38].status).toEqual('working_on_it');

		expect(result).toEqual(_.orderBy(rawData, ['status'], ['asc']));
	});

	it('sorts by status descending', () => {
		const result = datawranglers.sort(rawData, 'status', 'desc');

		expect(result[0].status).toEqual('working_on_it');
		expect(result[38].status).toEqual('complete');

		expect(result).toEqual(_.orderBy(rawData, ['status'], ['desc']));
	});
});
