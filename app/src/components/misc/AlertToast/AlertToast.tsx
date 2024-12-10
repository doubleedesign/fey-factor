import { FC, PropsWithChildren } from 'react';
import { StyledAlertToast } from './AlertToast.style';
import { CloseButton } from '../../common.ts';

type AlertToastProps = PropsWithChildren & {
	onClose: () => void;
};

export const AlertToast: FC<AlertToastProps> = ({ onClose, children }) => {
	return (
		<StyledAlertToast data-testid="AlertToast">
			{children}
			<CloseButton onClick={onClose} aria-label="Close alert"><i className="fa-light fa-xmark"></i></CloseButton>
		</StyledAlertToast>
	);
};
