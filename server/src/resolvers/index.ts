import merge from 'lodash/merge';
import ConnectionResolvers from './Connection';
import PersonResolvers from './Person';
import RoleResolvers from './Role';
import WorkResolvers from './Work';
import MovieResolvers from './Movie';
import TvShowResolvers from './TvShow';


export default merge({}, ConnectionResolvers, PersonResolvers, RoleResolvers, WorkResolvers, MovieResolvers, TvShowResolvers);