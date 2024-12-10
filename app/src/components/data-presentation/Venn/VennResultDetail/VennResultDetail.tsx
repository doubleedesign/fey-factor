import { FC, MouseEvent, useCallback } from 'react';
import { StyledVennResultDetail, StyledVennResultDetailHeader, StyledVennResultDetailBody } from './VennResultDetail.style';
import { Heading, Label } from '../../../typography';
import { CloseButton } from '../../../common.ts';
import Case from 'case';

type VennResultDetailProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	selection: any;
	onClose: () => void;
};

export const VennResultDetail: FC<VennResultDetailProps> = ({ selection, onClose }) => {

	const handleLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		// TODO: Launch a modal
		console.log(event.currentTarget.hash.replace('#', ''));
	}, []);

	return (
		<StyledVennResultDetail data-testid="VennResultDetail">
			<StyledVennResultDetailHeader>
				<div>
					<Label text={Case.title(selection.type)} type="subtler" />
					<Heading level="h3">{selection.name.replace('(', '').replace(')', '')}</Heading>
				</div>
				<CloseButton onClick={onClose} aria-label="Close detail panel">
					<i className="fa-light fa-xmark"></i>
				</CloseButton>
			</StyledVennResultDetailHeader>
			<StyledVennResultDetailBody>
				<p>
					<strong>People: </strong>
					{selection.elems
						// @ts-expect-error TS7006: Parameter elem implicitly has an any type.
						.map((elem) => {
							return <a onClick={handleLinkClick} href={`#${elem.id}`}>{elem.name}</a>;
						})
						// @ts-expect-error TS7006: Parameter prev implicitly has an any type.
						.reduce((prev, curr) => [prev, ', ', curr])}
				</p>
			</StyledVennResultDetailBody>
		</StyledVennResultDetail>
	);
};
