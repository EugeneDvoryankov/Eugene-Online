import 'dotenv/config';
import app from './start';

// Running dotenv here before importing app
// Because app imports from conn which get username, password, and db

// Changed from 8080 to 3000 because that is what the deployment server expects
// const PORT = 8080;
const PORT = process.env.API_PORT;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
