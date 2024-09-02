import { FC, useState, useEffect } from 'react';
import { StyledEditionCard, StyledProfileImage, StyledProfileName, StyledProfileText } from './EditionCard.style';
import { Edition } from '../../types.ts';
import { Label } from '../Label/Label.tsx';

export const EditionCard: FC<Edition> = ({ personId, title, tag }: Edition) => {
	const apiKey = import.meta.env.VITE_TMDB_API_KEY;
	const [profileData, setProfileData] = useState<{ name: string; profile_path: string }>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}`);
				const data = await response.json();
				setProfileData(data);
			}
			catch (error) {
				console.error('Error fetching person data:', error);
			}
		};

		fetchData();
	}, [apiKey, personId]);

	return profileData && (
		<StyledEditionCard data-testid="EditionCard">
			<StyledProfileImage>
				{profileData?.profile_path ? (
					<img src={`https://image.tmdb.org/t/p/w185${profileData.profile_path}`} alt={profileData.name}/>
				) : (
					<i className="fa-duotone fa-solid fa-camera-retro"></i>
				)}
			</StyledProfileImage>
			<StyledProfileText>
				<span>{title}</span>
				<StyledProfileName>
					{profileData.name}
					{tag && <Label type="success" text={tag} />}
				</StyledProfileName>
			</StyledProfileText>
		</StyledEditionCard>
	);
};
