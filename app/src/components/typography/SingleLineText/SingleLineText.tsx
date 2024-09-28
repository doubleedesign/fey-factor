import { FC } from 'react';
import { StyledSingleLineText } from './SingleLineText.style';

type SingleLineTextProps = {
	text: string;
};

export const SingleLineText: FC<SingleLineTextProps> = ({ text }) => {
	return (
		<StyledSingleLineText data-testid="SingleLineText">
			{text}
		</StyledSingleLineText>
	);
};
