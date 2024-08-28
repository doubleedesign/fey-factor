export default {
	Work: {
		__resolveType: (work) => {
			return work.release_year ? 'Movie' : 'TvShow';
		}
	}
};
