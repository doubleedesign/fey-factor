import { FC } from 'react';
import {
	StyledMultiSelect,
	StyledMultiSelectInvisibleCheckbox,
	StyledMultiSelectLabel,
	StyledMultiSelectLabelIconOnly,
	StyledMultiSelectOptionWrapper
} from './MultiSelect.style';
import Select, { components, MultiValue } from 'react-select';
import { MultiSelectOption } from '../../../types.ts';

type MultiSelectProps = {
	label: string;
	options: MultiSelectOption[];
	selectedOptions: MultiValue<MultiSelectOption>;
	onChange: (selected: MultiValue<MultiSelectOption>) => void;
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
					components={{
						// The option as shown in the drop-down
						Option: (props) => {
							return (
								<StyledMultiSelectOptionWrapper>
									<components.Option {...props}>
										<StyledMultiSelectInvisibleCheckbox
											id={props.data.value}
											type="checkbox"
											checked={props.isSelected}
											onChange={() => null}
										/>
										<StyledMultiSelectLabel htmlFor={props.data.value}>{props.label}</StyledMultiSelectLabel>
									</components.Option>
								</StyledMultiSelectOptionWrapper>
							);
						},
						// The option as shown when selected
						MultiValue: (props) => {
							// @ts-expect-error TS2339: Property props does not exist on type string (I'm expecting a ReactNode, not a string)
							const icon = props.data.label?.props?.children.find((child) => child.type === 'img').props;

							return icon ? (
								<StyledMultiSelectLabelIconOnly {...props.removeProps}>
									<img src={icon.src} alt={icon.alt}/>
								</StyledMultiSelectLabelIconOnly>
							) : (
								<components.MultiValue {...props}>
									<StyledMultiSelectLabel>{props.data.label}</StyledMultiSelectLabel>
								</components.MultiValue>
							);
						}
					}}
					onChange={onChange}
				/>
			</label>
		</StyledMultiSelect>
	);
};
