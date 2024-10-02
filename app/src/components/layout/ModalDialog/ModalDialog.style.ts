import styled from 'styled-components';
import { transparentize } from 'polished';

export const StyledModalDialogWrapper = styled.div<{ $open: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${props => props.$open ? transparentize(0.2, props.theme.colors.dark) : 'transparent'};
	z-index: ${props => props.$open ? 2000 : -1};
	transition: ${props => {
		return props.$open ? 'background 0.2s 0.1s, z-index 0s 0s' : 'background 0.2s, z-index 0s 0.2s';
	}};
	padding-block: ${props => props.theme.spacing.xl};
	box-sizing: border-box;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	overflow: hidden;
`;

export const StyledModalDialog = styled.section`
	background: ${props => props.theme.colors.background};
	padding: ${props => props.theme.spacing.md};
	box-sizing: border-box;
	width: 100%;
	max-width: 40rem;
	border-radius: ${props => props.theme.spacing.xs};
	max-height: calc(100dvh - 2 * ${props => props.theme.spacing.xl});
	overflow-y: auto;
`;

export const StyledModalHeader = styled.header``;

export const StyledModalContent = styled.div``;