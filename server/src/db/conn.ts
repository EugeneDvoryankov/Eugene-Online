import { Sequelize } from 'sequelize';

const {
  POSTGRES_USERNAME: username,
  POSTGRES_PASSWORD: password,
  POSTGRES_HOST: host,
  POSTGRES_DB: db,
} = process.env;
console.log(`postgres://${username}:${password}@${host}.com:5432/${db}`);
// This does not work for some reason but connection with arguments work
/* const sequelize = new Sequelize(`postgres://${username}:${password}@${host}.com:5432/${db}`, {
  dialect: 'postgres',
}); */
const sequelize = new Sequelize(db!, username!, password, {
  host: host!,
  dialect: 'postgres',
});

/* (async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await sequelize.sync({ alter: true, force: false });
  console.log('Sequelize synchronized');
})(); */

export default sequelize;
