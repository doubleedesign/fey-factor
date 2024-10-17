import { FC, useCallback, useState } from 'react';
import { StyledSingleValueSelect } from './SingleValueSelect.style';
import Select, { SingleValue } from 'react-select';

type Option = {
	label: string;
	value: string;
};

type SingleValueSelectProps = {
	label: string;
	options: Option[];
	defaultSelected: SingleValue<Option>;
	onChange: (value: string) => void;
};

export const SingleValueSelect: FC<SingleValueSelectProps> = ({ label, options, defaultSelected, onChange }) => {
	const [selectedOption, setSelectedOption] = useState<SingleValue<Option>>(defaultSelected);

	const handleChange = useCallback(
		(selected: SingleValue<Option>) => {
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
