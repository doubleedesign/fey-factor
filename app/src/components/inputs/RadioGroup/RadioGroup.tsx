import { ChangeEvent, FC, useCallback } from 'react';
import { SingleSelectOption } from '../../../types.ts';
import snakeCase from 'lodash/snakeCase';
import { StyledFieldset } from '../common.ts';

type RadioGroupProps = {
	label: string;
	options: SingleSelectOption[];
	selectedOption: SingleSelectOption | null;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const RadioGroup: FC<RadioGroupProps> = ({ label, options, selectedOption, onChange }) => {

	const renderInput = useCallback((option: SingleSelectOption, index: number) => {
		const isChecked = selectedOption?.value === option.value || false;

		return (
			<label key={index}>
				<input
					type="radio"
					name={snakeCase(label)}
					value={option.value}
					checked={isChecked}
					onChange={onChange}
				/>
				<span>{option.label}</span>
			</label>
		);
	}, [selectedOption, label, onChange]);

	return (
		<StyledFieldset data-testid="RadioGroup">
			<legend>{label}</legend>
			{options.map((option, index) => (
				renderInput(option, index)
			))}
		</StyledFieldset>
	);
};
