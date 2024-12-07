import { FC, useState, useCallback, useMemo, ReactNode } from 'react';
import Select, { SingleValue } from 'react-select';
import { StyledNumberPicker } from './NumberPicker.style';
import { StyledSelectLabel } from '../common.ts';

type NumberPickerProps = {
	label: string | ReactNode;
	defaultValue: number;
	onChange: (value: number) => void;
	options?: number[];
	disabled?: boolean;
};

export const NumberPicker: FC<NumberPickerProps> = ({ label, defaultValue, onChange, options, disabled = false }) => {
	const [selectedOption, setSelectedOption] = useState<{ value: number; label: number }>({ value: defaultValue, label: defaultValue });

	const optionsToUse = useMemo(() => {
		if (options) {
			return options.map(option => ({ value: option, label: option }));
		}

		return Array.from({ length: 6 }, (_, i) => {
			const value = Math.floor((defaultValue * i));

			return { value, label: value };
		})
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
				<StyledSelectLabel>{label}</StyledSelectLabel>
				<Select
					defaultValue={selectedOption}
					onChange={handleChange}
					options={optionsToUse}
					isDisabled={disabled}
				/>
			</label>
		</StyledNumberPicker>
	);
};
