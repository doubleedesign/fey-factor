import { FC } from 'react';
import { StyledLabel } from './Label.style';

type LabelProps = {
	type?: 'info' | 'warning' | 'success' | 'error' | 'accent';
	text: string;
};

export const Label: FC<LabelProps> = ({ type = 'info', text }: LabelProps) => {
	return (
		<StyledLabel data-testid="Label" type={type}>
			{text}
		</StyledLabel>
	);
};
