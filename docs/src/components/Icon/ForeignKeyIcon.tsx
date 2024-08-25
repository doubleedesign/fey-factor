import { FC } from 'react';
import { StyledIcon } from './Icon.style.ts';

export const ForeignKeyIcon: FC = () => {
	return (
		<StyledIcon title="Foreign key" data-testid="ForeignKeyIcon">
			<i className="fa-light fa-key"></i>
		</StyledIcon>
	);
};