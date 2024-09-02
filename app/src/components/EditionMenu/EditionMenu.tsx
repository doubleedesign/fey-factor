import { FC } from 'react';
import { StyledEditionMenu, StyledEditionOptionWrapper, StyledSelectControlWrapper } from './EditionMenu.style';
import { EditionCard } from '../EditionCard/EditionCard';
import { Edition } from '../../types';
import Select, { components, ControlProps, OptionProps, SingleValueProps } from 'react-select';
import { useTheme } from 'styled-components';
import { tint } from 'polished';

type EditionMenuProps = {
	selected?: number;
};

export const EditionMenu: FC<EditionMenuProps> = ({ selected = 56323 }) => {
	const myTheme = useTheme();

	const editions: Edition[] = [
		{
			personId: 56323,
			title: 'American Comedy',
			tag: 'The OG'
		},
		{
			personId: 1424645,
			title: 'Australian Drama'
		}
	];

	const CustomOption: FC<OptionProps<Edition>> = ({ data, innerRef, innerProps, isSelected, isFocused }) => {
		return (
			<StyledEditionOptionWrapper
				ref={innerRef}
				{...innerProps}
				isSelected={isSelected}
				isFocused={isFocused}
			>
				<EditionCard {...data} />
			</StyledEditionOptionWrapper>
		);
	};

	const CustomSingleValue: FC<SingleValueProps<Edition>> = ({ data }) => {
		return (
			<StyledEditionOptionWrapper isSelected={true} isFocused={false}>
				<EditionCard {...data} />
			</StyledEditionOptionWrapper>
		);
	};

	const CustomControlWrapper: FC<ControlProps<Edition>> = (props) => {
		return (
			<StyledSelectControlWrapper>
				<components.Control {...props } />
			</StyledSelectControlWrapper>
		);
	};

	return (
		<StyledEditionMenu data-testid="EditionMenu" aria-label="App edition">
			<Select
				components={{
					Option: CustomOption,
					SingleValue: CustomSingleValue,
					Control: CustomControlWrapper,
					IndicatorSeparator: () => null
				}}
				options={editions}
				isSearchable={false}
				getOptionLabel={(option) => option.title}
				getOptionValue={(option) => String(option.personId)}
				defaultValue={editions.find(edition => edition.personId === selected)}
				theme={(theme) => ({
					...theme,
					colors: {
						...theme.colors,
						neutral0: myTheme.colors.secondary,
						primary: tint(0.5, myTheme.colors.secondary),
						primary25: tint(0.9, myTheme.colors.secondary),
					}
				})}
			/>
		</StyledEditionMenu>
	);
};