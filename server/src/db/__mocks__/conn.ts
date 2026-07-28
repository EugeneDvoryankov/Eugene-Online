import { Sequelize } from 'sequelize';

console.log('Running in-memory database');
const sequelize = new Sequelize('sqlite::memory:');
export default sequelize;
