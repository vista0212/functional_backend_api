import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { POOL } from './db.js';
import { catchDBError } from './lib.js';
import _ from 'fxjs/Strict';
import L from 'fxjs/Lazy';

const { QUERY } = POOL;

import { register, login, patch_user, delete_user } from './routes/user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan());

app.listen(3000, () => {
  console.log(`Server on port 3000`);
});

app.get('/status', (req, res) => {
  return res.json({
    success: true,
  });
});

app.post('/register', register);
app.post('/login', login);
app.patch('/patch', patch_user);
app.delete('/delete', delete_user);

app.get('/user', async (req, res) => {
  // 만약 age의 값이 10이면 10살 이상의 유저를 찾는다.(if value of age is 10, then find user over 10 years old.)
  // 만약 gender의 값이 F라면 여자인 유저를 찾는다.(if value of gender is F, then find user who is a woman.)(F == Female, M == Male)
  // 만약 limit의 값이 1이면 값을 1개만 가져온다.(if value of limit is 1, then take only one.)
  const { age, gender, limit } = req.query;

  const users = await QUERY`SELECT * FROM user`.catch(catchDBError(res));

  const result = _.go(
    users,
    L.filter((user) => (age ? user.age >= age : user)),
    L.filter((user) => (gender ? user.gender == gender : user)),
    _.take(limit || Infinity)
  );

  return res.json({
    success: true,
    users: result,
  });
});

app.use((_, res) => {
  return res.status(404).json({
    success: false,
    message: 'not found page',
  });
});
