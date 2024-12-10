import { FC, PropsWithChildren, useState, useEffect, useCallback, ReactNode, Fragment } from 'react';
import { StyledModalContent, StyledModalDialog, StyledModalDialogWrapper, StyledModalHeader } from './ModalDialog.style';
import { CloseButton, StyledButton, StyledButtonGroup } from '../../common.ts';

type ModalDialogProps = {
	open: boolean;
	title: string | ReactNode;
	isList?: boolean;
	batchSize?: number;
	onClose?: () => void;
};

const ModalDialogContentList: FC<{ items: ReactNode[] }> = ({ items }) => {
	return (
		<>
			{items.map((item, index) => (
				<Fragment key={index}>{item}</Fragment>
			))}
		</>
	);
};

export const ModalDialog: FC<PropsWithChildren<ModalDialogProps>> = ({ open, title, isList, batchSize = 3, onClose, children }) => {
	const [items, setItems] = useState<ReactNode[]>([]);

	useEffect(() => {
		if(isList && Array.isArray(children)) {
			if(children.length > batchSize) {
				setItems(children?.slice(0, batchSize));
			}
		}
		else {
			setItems([children]);
		}
	}, [children, isList, batchSize]);
	
	const handleLoadMore = useCallback(() => {
		if(isList && Array.isArray(children)) {
			setItems([...items, ...children.slice(items.length, items.length + batchSize)]);
		}
	}, [batchSize, children, isList, items]);

	return (
		<StyledModalDialogWrapper $open={open}>
			{open &&
				<StyledModalDialog data-testid="ModalDialog" role="dialog" data-open={open} aria-modal="true">
					<StyledModalHeader>
						<h2>{title}</h2>
						<CloseButton onClick={onClose} aria-label="Close dialog"><i className="fa-light fa-xmark"></i></CloseButton>
					</StyledModalHeader>
					<StyledModalContent>
						<ModalDialogContentList items={items} />
						<StyledButtonGroup $align="center">
							{isList && Array.isArray(children) && children.length > items.length && (
								<StyledButton onClick={handleLoadMore}>Load more</StyledButton>
							)}
						</StyledButtonGroup>
					</StyledModalContent>
				</StyledModalDialog>
			}
		</StyledModalDialogWrapper>
	);
};