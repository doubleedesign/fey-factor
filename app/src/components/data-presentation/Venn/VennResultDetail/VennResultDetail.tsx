import { FC, useState, useMemo, useCallback } from 'react';
import { StyledVennResultDetail, StyledVennResultDetailHeader, StyledVennResultDetailBody } from './VennResultDetail.style';
import { Heading, Label } from '../../../typography';
import { CloseButton } from '../../../common.ts';
import { ModalDialog } from '../../../layout/ModalDialog/ModalDialog.tsx';
import Case from 'case';
import { VennSet } from '../../../../types.ts';

type VennResultDetailProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	selection: any;
	onClose: () => void;
};

export const VennResultDetail: FC<VennResultDetailProps> = ({ selection, onClose }) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalPersonId, setModalPersonId] = useState<string>('');

	const title = useMemo(() => {
		return selection.name.replace('(', '').replace(')', '');
	}, [selection.name]);

	const handleItemClick = useCallback((id: string) => {
		setModalPersonId(id);
		setModalOpen(true);
	}, []);

	const selectedPerson = useMemo(() => {
		return selection.elems.find((elem: VennSet) => elem.id === modalPersonId);
	}, [modalPersonId, selection.elems]);

	const consolitatedElems = useMemo(() => {
		return selection.elems.reduce((acc: (VennSet & { instances: number })[], elem: VennSet) => {
			if (!acc.find((e) => e.id === elem.id)) {
				acc.push({
					...elem,
					instances: selection.elems.filter((e: VennSet) => e.id === elem.id).length
				});
			}

			return acc;
		}, [] as (VennSet & { instances: number })[]);

	}, [selection.elems]);

	const handleModalClose = useCallback(() => {
		setModalOpen(false);
		setModalPersonId('');
	}, []);

	return (
		<>
			<StyledVennResultDetail data-testid="VennResultDetail">
				<StyledVennResultDetailHeader>
					<div>
						<Label text={`Selected ${Case.title(selection.type)}`} type="accent" />
						<Heading level="h3">{title}</Heading>
					</div>
					<CloseButton onClick={onClose} aria-label="Close detail panel">
						<i className="fa-light fa-xmark"></i>
					</CloseButton>
				</StyledVennResultDetailHeader>
				<StyledVennResultDetailBody>
					<ul>
						{consolitatedElems.map((elem: VennSet & { instances?: number }) =>	(
							<li key={elem.id}>
								<button onClick={() => handleItemClick(elem.id)}>
									{elem.name} {elem?.instances && elem.instances > 1 ? `(x ${elem?.instances} roles)` : ''}
								</button>
							</li>
						))}
					</ul>
				</StyledVennResultDetailBody>
			</StyledVennResultDetail>
			<ModalDialog
				open={modalOpen}
				title={<>
					<Label type="subtle" text={title} /><br/>
					<span>{selectedPerson?.name || ''}</span>
				</>}
				onClose={handleModalClose}
				isList={false}
			>
				<p>Coming soon: This person's roles in these shows</p>
				<p>
					<strong>Appearances in these results:</strong>&nbsp;
					{selectedPerson?.sets.join(', ')}.
				</p>
			</ModalDialog>
		</>
	);
};
