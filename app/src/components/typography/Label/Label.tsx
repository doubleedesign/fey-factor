import { FC } from 'react';
import { StyledLabel } from './Label.style';

type LabelProps = {
	text: string;
	type?: 'info' | 'warning' | 'success' | 'error' | 'accent' | 'subtle' | 'subtler';
};

export const Label: FC<LabelProps> = ({ text, type = 'info' }: LabelProps) => {
	return (
		<StyledLabel data-testid="Label" type={type} aria-label={`{${text})`}>
			{text}
		</StyledLabel>
	);
};
