export default {
	WorkContainer: {
		__resolveType: (container) => {
			return container.release_year ? 'MovieContainer' : 'TvShowContainer';
		}
	},
	Work: {
		__resolveType: (work) => {
			return work.release_year ? 'Movie' : 'TvShow';
		}
	}
};
