import merge from 'lodash/merge';
import PersonResolvers from './Person';
import RoleResolvers from './Role';
import WorkResolvers from './Work';
import MovieResolvers from './Movie';
import TvShowResolvers from './TvShow';


export default merge({}, PersonResolvers, RoleResolvers, WorkResolvers, MovieResolvers, TvShowResolvers);