import { FC, PropsWithChildren } from 'react';
import { Tooltip, type PlacesType } from 'react-tooltip';
import { StyledTooltippedElement } from './TooltippedElement.style';

type TooltippedElementProps = {
	id: string;
	tooltip: string;
	position?: PlacesType;
};

export const TooltippedElement: FC<PropsWithChildren<TooltippedElementProps>> = ({ id, tooltip, position, children }) => {
	return (
		<StyledTooltippedElement role="presentation" data-tooltip-id={id} data-tooltip-content={tooltip} data-testid="TooltippedElement">
			{children}
			<Tooltip id={id} place={position}/>
		</StyledTooltippedElement>
	);
};
