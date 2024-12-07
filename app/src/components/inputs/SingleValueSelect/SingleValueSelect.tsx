import { FC, useCallback, useState } from 'react';
import { StyledSingleValueSelect } from './SingleValueSelect.style';
import Select, { SingleValue } from 'react-select';
import { SingleSelectOption } from '../../../types.ts';

type SingleValueSelectProps = {
	label: string;
	options: SingleSelectOption[];
	defaultSelected: SingleValue<SingleSelectOption>;
	onChange: (value: string) => void;
};

export const SingleValueSelect: FC<SingleValueSelectProps> = ({ label, options, defaultSelected, onChange }) => {
	const [selectedOption, setSelectedOption] = useState<SingleValue<SingleSelectOption>>(defaultSelected);

	const handleChange = useCallback(
		(selected: SingleValue<SingleSelectOption>) => {
			if (selected) {
				setSelectedOption(selected);
				onChange(selected.value as string);
			}
		},
		[onChange]
	);

	return (
		<StyledSingleValueSelect data-testid="SingleValueSelect">
			<label>
				<span>{label}</span>
				<Select
					value={selectedOption}
					onChange={handleChange}
					options={options}
					defaultInputValue={selectedOption?.value as string}
					placeholder="Select node type"
				/>
			</label>
		</StyledSingleValueSelect>
	);
};
