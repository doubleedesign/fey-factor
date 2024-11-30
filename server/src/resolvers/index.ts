import merge from 'lodash/merge';
import EdgeResolvers from './Edge';
import MovieResolvers from './Movie';
import NodeResolvers from './Node';
import PersonResolvers from './Person';
import TvShowResolvers from './TvShow';
import WorkResolvers from './Work';
import VennDiagramResolvers from './VennDiagram';


export default merge({}, EdgeResolvers, MovieResolvers, NodeResolvers, PersonResolvers, TvShowResolvers, WorkResolvers, VennDiagramResolvers);