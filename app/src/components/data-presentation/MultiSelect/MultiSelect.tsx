import { FC } from 'react';
import { StyledMultiSelect } from './MultiSelect.style';
import Select, { components, MultiValue } from 'react-select';

type MultiSelectProps = {
	label: string;
	options: { value: string; label: string }[];
	selectedOptions: MultiValue<{ value: string; label: string }>;
	onChange: (selected: MultiValue<{ value: string; label: string }>) => void;
};

const Option = (props) => {
	return (
		<components.Option {...props}>
			<input
				type="checkbox"
				checked={props.isSelected}
				onChange={() => null}
			/>
			<label>{props.label}</label>
		</components.Option>
	);
};

export const MultiSelect: FC<MultiSelectProps> = ({ label, options, selectedOptions, onChange }) => {
	return (
		<StyledMultiSelect data-testid="MultiSelect">
			<label>
				<span>{label}</span>
				<Select
					isMulti
					options={options}
					value={selectedOptions}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
					components={{ Option }}
					onChange={onChange}
				/>
			</label>
		</StyledMultiSelect>
	);
};
