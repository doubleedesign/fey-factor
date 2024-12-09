import { FC } from 'react';
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
	console.log(selection);

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
					{selection.elems.map((elem: { name: any; }) => elem.name).join(', ')}
				</p>
			</StyledVennResultDetailBody>
		</StyledVennResultDetail>
	);
};
