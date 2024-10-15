import merge from 'lodash/merge';
import MovieResolvers from './Movie';
import PersonResolvers from './Person';
import TvShowResolvers from './TvShow';
import WorkResolvers from './Work';
import NodeResolvers from './Node';
import EdgeResolvers from './Edge';


export default merge({}, MovieResolvers, PersonResolvers, TvShowResolvers, WorkResolvers, NodeResolvers, EdgeResolvers);