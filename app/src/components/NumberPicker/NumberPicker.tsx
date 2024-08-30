import { FC, useState, useCallback, useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import { StyledNumberPicker } from './NumberPicker.style';

type NumberPickerProps = {
	defaultValue: number;
	onChange: (value: number) => void;
};

export const NumberPicker: FC<NumberPickerProps> = ({ defaultValue, onChange }) => {
	const [selectedOption, setSelectedOption] = useState<{ value: number; label: number }>({ value: defaultValue, label: defaultValue });

	const options = useMemo(() => {
		return [{ value: defaultValue/2, label: defaultValue / 2 }]
			.concat(Array.from({ length: 6 }, (_, i) => {
				const value = (defaultValue * i);

				return { value, label: value };
			}))
			.filter(option => option.value > 0);
	}, [defaultValue]);

	const handleChange = useCallback(
		(selected: SingleValue<{ value: number; label: number }>) => {
			if (selected) {
				setSelectedOption(selected);
				onChange(selected.value);
			}
		},
		[onChange]
	);

	return (
		<StyledNumberPicker data-testid="NumberPicker">
			<label>
				<span>Show top:</span>
				<Select
					defaultValue={selectedOption}
					onChange={handleChange}
					options={options}
				/>
			</label>
		</StyledNumberPicker>
	);
};
