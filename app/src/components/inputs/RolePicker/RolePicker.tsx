import { FC, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { RolePickerQuery } from '../../../__generated__/RolePickerQuery.graphql.ts';
import { RelayComponentWrapper } from '../../wrappers/RelayComponentWrapper/RelayComponentWrapper.tsx';
import { MultiSelect } from '../MultiSelect/MultiSelect.tsx';
import { useVennContext } from '../../../controllers/VennContext.tsx';
import { MultiValue } from 'react-select';
import { MultiSelectOption } from '../../../types.ts';
import * as Case from 'case';
import { StyledRolePicker } from './RolePicker.style';

type RolePickerProps = {
	label: string | ReactNode;
};

export const RolePicker: FC<RolePickerProps> = ({ label }) => {
	const { selectedRoles, setSelectedRoles } = useVennContext();

	const roleData = useLazyLoadQuery<RolePickerQuery>(
		graphql`
            query RolePickerQuery {
                Roles {
                    id
                    name
                }
            }
		`,
		{}
	);

	const roles = useMemo(() => {
		return roleData?.Roles?.map((role) => ({
			label: Case.title(role?.name as string),
			value: role?.id.toString() as string,
		}));
	}, [roleData.Roles]);

	useEffect(() => {
		const defaultSelected = roles?.filter((role) => {
			return ['Cast', 'Writer', 'Executive Producer'].includes(role.label);
		});

		setSelectedRoles(defaultSelected as MultiValue<MultiSelectOption>);
	}, [roles, setSelectedRoles]);

	const handleRoleSelectionChange = useCallback((selectedRoles: MultiValue<MultiSelectOption>) => {
		setSelectedRoles(selectedRoles);
	}, [setSelectedRoles]);

	return (
		<StyledRolePicker data-testid="RolePicker">
			<RelayComponentWrapper>
				<MultiSelect
					label={label}
					options={roles ?? []}
					selectedOptions={selectedRoles}
					onChange={handleRoleSelectionChange}
					showAs="checkboxes"
					size="large"
				/>
			</RelayComponentWrapper>
		</StyledRolePicker>
	);
};
