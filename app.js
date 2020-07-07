import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { register, login } from './routes/user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan());

app.listen(3000, () => {
  console.log(`Server on port 3000`);
});

app.get('/status', (req, res) => {
  res.json({
    success: true,
  });
});

app.post('/register', register);
app.post('/login', login);
