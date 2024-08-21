import { FC } from 'react';
import { StyledIcon } from './Icon.style.ts';

export const PrimaryKeyIcon: FC = () => {
	return (
		<StyledIcon title="Primary key" data-testid="PrimaryKeyIcon">
			<i className="fa-solid fa-key"></i>
		</StyledIcon>
	);
};
