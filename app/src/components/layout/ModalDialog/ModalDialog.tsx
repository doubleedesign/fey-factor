import { FC, PropsWithChildren, useState, useEffect, useCallback, ReactNode, Fragment } from 'react';
import { StyledModalContent, StyledModalDialog, StyledModalDialogWrapper, StyledModalHeader } from './ModalDialog.style';

type ModalDialogProps = {
	open: boolean;
	title: string;
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

export const ModalDialog: FC<PropsWithChildren<ModalDialogProps>> = ({ open, title, isList, batchSize = 5, onClose, children }) => {
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
						{title}
						<button onClick={onClose}>Close</button>
					</StyledModalHeader>
					<StyledModalContent>
						<ModalDialogContentList items={items} />
						{isList && Array.isArray(children) && children.length > items.length && (
							<button onClick={handleLoadMore}>Load more</button>
						)}
					</StyledModalContent>
				</StyledModalDialog>
			}
		</StyledModalDialogWrapper>
	);
};