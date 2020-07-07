import { log } from 'fxjs/Strict';
import { POOL } from '../db.js';
import { catchDBError } from '../lib.js';
const { QUERY } = POOL;

function findByUserId(user_id) {
  return QUERY`SELECT * FROM user WHERE id = ${user_id}`;
}

export const register = async (req, res) => {
  const { id, password, name } = req.body;

  if (!(id && password && name)) {
    return res.status(412).json({
      success: false,
      message: 'wrong data',
    });
  }

  const user = await findByUserId(id).catch(catchDBError(res));

  if (user.length) {
    return res.status(412).json({
      success: false,
      message: 'exist data',
    });
  }

  await QUERY`INSERT INTO user (
    id,
    password,
    name
  ) VALUES (
    ${id},
    ${password},
    ${name}
  )`.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'register succeed',
  });
};

export const login = async (req, res) => {
  const { id, password } = req.body;

  const user = await findByUserId(id).catch(catchDBError(res));

  if (!user.length) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  if (user[0].password != password) {
    return res.status(412).json({
      success: false,
      message: 'login failed',
    });
  }

  return res.json({
    success: true,
    message: 'login succeed',
  });
};
