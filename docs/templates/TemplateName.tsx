import { FC } from 'react';
import { StyledTemplateName } from './TemplateName.style';

type TemplateNameProps = {}

export const TemplateName: FC<TemplateNameProps> = () => {
	return (
		<StyledTemplateName data-testid="TemplateName">
			TemplateName Component
		</StyledTemplateName>
	);
};
