import merge from 'lodash/merge';
import MovieResolvers from './Movie';
import NodeResolvers from './Node';
import PersonResolvers from './Person';
import TvShowResolvers from './TvShow';
import WorkResolvers from './Work';
import EdgeResolvers from './Edge';


export default merge({}, MovieResolvers, NodeResolvers, PersonResolvers, TvShowResolvers, WorkResolvers, EdgeResolvers);