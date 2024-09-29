import { FC, useMemo } from 'react';
import { StyledMoreProvidersIndicator, StyledProviderItem, StyledProviderList } from './ProviderLogos.style';
import { Provider } from '../../../types';
import { TooltippedElement } from '../../typography';
import { providerOrder } from '../../../constants.tsx';
import { sortProviders } from '../../../controllers';

type ProviderLogosProps = {
	providers: Provider[];
};

export const ProviderLogos: FC<ProviderLogosProps> = ({ providers }) => {
	const sortedProviders = useMemo(() => {
		return sortProviders(providers);
	}, [providers]);

	const topThree = sortedProviders.slice(0, 3);
	const more = sortedProviders.slice(3);
 
	return (
		<StyledProviderList data-testid="ProviderList">
			{topThree.map(provider => {
				const key = `${provider.provider_id}-${provider.provider_name}`;

				return (
					<StyledProviderItem key={key}>
						<TooltippedElement id={key} tooltip={provider.provider_name} position="bottom">
							<img src={`https://media.themoviedb.org/t/p/original/${provider.logo_path}`} alt={provider.provider_name}/>
						</TooltippedElement>
					</StyledProviderItem>
				);
			})}
			{more.length > 0 &&
				<TooltippedElement id="more-providers" tooltip={`${more.map(provider => provider.provider_name).join(', ')}`} position="right">
					<StyledMoreProvidersIndicator>
						<i className="fa-regular fa-ellipsis"></i>
					</StyledMoreProvidersIndicator>
				</TooltippedElement>
			}
		</StyledProviderList>
	);
};
