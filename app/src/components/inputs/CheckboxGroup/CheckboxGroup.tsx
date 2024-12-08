import { FC, useCallback, ChangeEvent } from 'react';
import { StyledCheckboxGroup } from './CheckboxGroup.style';
import { MultiSelectOption } from '../../../types.ts';

type CheckboxGroupProps = {
	label: string;
	options: MultiSelectOption[];
	selectedOptions: MultiSelectOption[];
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	maxSelections?: number;
};

export const CheckboxGroup: FC<CheckboxGroupProps> = ({ label, options, selectedOptions, onChange, maxSelections = 10 }) => {

	const renderInput = useCallback((option: MultiSelectOption, index: number) => {
		const isChecked = !!selectedOptions.find(selectedOption => selectedOption.value === option.value);
		const isDisabled = selectedOptions.length >= maxSelections && !isChecked;

		return (
			<label key={index}>
				<input
					type="checkbox"
					value={option.value}
					checked={isChecked}
					disabled={isDisabled}
					onChange={onChange}
				/>
				<span>{option.label}</span>
			</label>
		);
	}, [selectedOptions, maxSelections, onChange]);

	return (
		<StyledCheckboxGroup data-testid="CheckboxGroup">
			<legend>{label}</legend>
			{options.map((option, index) => (
				renderInput(option, index)
			))}
		</StyledCheckboxGroup>
	);
};
