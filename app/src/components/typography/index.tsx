import { Heading } from './Heading/Heading';
import { Label } from './Label/Label';
import { TooltippedElement } from './Tooltip/TooltippedElement';
import { Button } from './Button/Button';
import styled from 'styled-components';

const LeadParagraph = styled.p`
	font-size: ${props => props.theme.fontSizes.md};
	
	&:first-of-type {
		margin-block-start: ${props => props.theme.spacing.sm};
	}
	
	&:last-child {
		margin-block-end: 0;
	}
`;

const FinePrint = styled.small`
	display: block;
	font-size: ${props => props.theme.fontSizes.xs};
`;

export {
	Heading,
	Label,
	TooltippedElement,
	FinePrint,
	LeadParagraph,
	Button
};
