import { Sequelize } from 'sequelize';

const {
  DATABASE_URL: databaseUrl,
  POSTGRES_USERNAME: username,
  POSTGRES_PASSWORD: password,
  POSTGRES_HOST: host,
  POSTGRES_DB: db,
} = process.env;
const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, { dialect: 'postgres', logging: false })
  : new Sequelize(db!, username!, password, { host, dialect: 'postgres', logging: false });

export default sequelize;
