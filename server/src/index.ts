import 'dotenv/config';
import app from './start';

// Running dotenv here before importing app
// Because app imports from conn which get username, password, and db

const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 3000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`listening on port ${PORT}`);
});
