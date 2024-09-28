import { FC, PropsWithChildren } from 'react';
import { StyledSelectionInputs } from './SelectionInputs.style';

export const SelectionInputs: FC<PropsWithChildren> = ({ children }) => {
	return (
		<StyledSelectionInputs data-testid="SelectionInputs">
			{children}
		</StyledSelectionInputs>
	);
};
