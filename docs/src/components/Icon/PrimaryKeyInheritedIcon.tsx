import { FC } from 'react';
import { StyledIcon } from './Icon.style.ts';

export const PrimaryKeyInheritedIcon: FC = () => {
	return (
		<StyledIcon title="Datebase primary key (inherited from supertype)" data-testid="InheritedPrimaryKeyIcon">
			<i className="fa-duotone fa-solid fa-key"></i>
		</StyledIcon>
	);
};
