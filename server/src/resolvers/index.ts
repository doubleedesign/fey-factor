import merge from 'lodash/merge';
import EdgeResolvers from './Edge';
import MovieResolvers from './Movie';
import NodeResolvers from './Node';
import PersonResolvers from './Person';
import RoleResolvers from './Role';
import TvShowResolvers from './TvShow';
import VennDiagramResolvers from './VennDiagram';
import WorkResolvers from './Work';


export default merge({}, EdgeResolvers, MovieResolvers, NodeResolvers, PersonResolvers, RoleResolvers, TvShowResolvers, VennDiagramResolvers, WorkResolvers);