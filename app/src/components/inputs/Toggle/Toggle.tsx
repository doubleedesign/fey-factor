import { FC, useCallback, ChangeEvent, ReactNode } from 'react';
import { StyledToggleField, StyledToggle } from './Toggle.style';

type ToggleProps = {
	label: string | ReactNode;
	value: boolean;
	onChange: (value: boolean) => void;
};

export const Toggle: FC<ToggleProps> = ({ label, onChange, value = false }) => {

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked);
	}, [onChange]);

	return (
		<StyledToggleField data-testid="ToggleField">
			<label>
				<span>{label}</span>
				<StyledToggle $checked={value}>
					<input type="checkbox" checked={value} onChange={handleChange} />
				</StyledToggle>
			</label>
		</StyledToggleField>
	);
};
