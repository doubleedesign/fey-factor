import { FC, ReactNode } from 'react';
import {
	StyledMultiSelect,
	StyledMultiSelectCheckbox,
	StyledMultiSelectInvisibleCheckbox,
	StyledMultiSelectItemLabel,
	StyledMultiSelectLabelIconOnly,
	StyledMultiSelectOptionWrapper, StyledMultiSelectSelectedPlainText
} from './MultiSelect.style';
import Select, { components, MultiValue } from 'react-select';
import { MultiSelectOption } from '../../../types.ts';
import { StyledSelectLabel } from '../common.ts';

type MultiSelectProps = {
	label: string | ReactNode;
	options: MultiSelectOption[];
	selectedOptions: MultiValue<MultiSelectOption>;
	onChange: (selected: MultiValue<MultiSelectOption>) => void;
	showAs?: 'default' | 'checkboxes';
	size?: 'small' | 'medium' | 'large';
};

export const MultiSelect: FC<MultiSelectProps> = ({ label, options, selectedOptions, onChange, showAs = 'default', size = 'medium' }) => {
	return (
		<StyledMultiSelect data-testid="MultiSelect" $size={size}>
			<label>
				<StyledSelectLabel>{label}</StyledSelectLabel>
				<Select
					isMulti
					options={options}
					value={selectedOptions}
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
					isClearable={showAs === 'default'}
					components={{
						// The option as shown in the drop-down
						Option: (props) => {
							if(showAs === 'checkboxes') {
								return (
									<StyledMultiSelectOptionWrapper>
										<components.Option {...props}>
											<StyledMultiSelectCheckbox
												id={props.data.value}
												type="checkbox"
												checked={props.isSelected}
												onChange={() => null}
											/>
											<StyledMultiSelectItemLabel htmlFor={props.data.value}>{props.label}</StyledMultiSelectItemLabel>
										</components.Option>
									</StyledMultiSelectOptionWrapper>
								);
							}

							return (
								<StyledMultiSelectOptionWrapper>
									<components.Option {...props}>
										<StyledMultiSelectInvisibleCheckbox
											id={props.data.value}
											type="checkbox"
											checked={props.isSelected}
											onChange={() => null}
										/>
										<StyledMultiSelectItemLabel htmlFor={props.data.value}>{props.label}</StyledMultiSelectItemLabel>
									</components.Option>
								</StyledMultiSelectOptionWrapper>
							);

						},
						// The option as shown when selected
						MultiValue: (props) => {
							if(showAs === 'checkboxes') {
								return (
									<components.MultiValue {...props}>
										<StyledMultiSelectItemLabel>{props.data.label}</StyledMultiSelectItemLabel>
									</components.MultiValue>
								);
							}

							// @ts-expect-error TS2339: Property props does not exist on type string (I'm expecting a ReactNode, not a string)
							const icon = props.data.label?.props?.children.find((child) => child.type === 'img').props;

							return icon ? (
								<StyledMultiSelectLabelIconOnly {...props.removeProps}>
									<img src={icon.src} alt={icon.alt}/>
								</StyledMultiSelectLabelIconOnly>
							) : (
								<components.MultiValue {...props}>
									<StyledMultiSelectItemLabel>{props.data.label}</StyledMultiSelectItemLabel>
								</components.MultiValue>
							);
						},
						// The wrapper around the selected options
						ValueContainer: (props) => {
							if(showAs === 'checkboxes') {
								return (
									<components.ValueContainer {...props}>
										<StyledMultiSelectSelectedPlainText>
											{selectedOptions.map(option => option.label).join(', ')}
											{/* @ts-expect-error TS7053: Element implicitly has an any type */}
											{props?.children?.[1]}
										</StyledMultiSelectSelectedPlainText>
									</components.ValueContainer>
								);
							}

							return (
								<components.ValueContainer {...props}>
									{props.children}
								</components.ValueContainer>
							);
						}
					}}
					onChange={onChange}
				/>
			</label>
		</StyledMultiSelect>
	);
};
