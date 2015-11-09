import IQueryBuilder from './IQueryBuilder';

let queryBuilder: IQueryBuilder = require('knex')({dialect: 'postgres'});

export default queryBuilder;
