import { POOL } from '../db.js';
import { catchDBError } from '../lib.js';
import { response } from 'express';
const { QUERY } = POOL;

function findByUserId(user_id) {
  return QUERY`SELECT * FROM user WHERE id = ${user_id}`;
}

export const register = async (req, res) => {
  const { id, password, name, age, gender } = req.body;

  if (!(id && password && name && age && gender)) {
    return res.status(412).json({
      success: false,
      message: 'wrong data',
    });
  }

  const [user] = await findByUserId(id).catch(catchDBError(res));

  if (user) {
    return res.status(412).json({
      success: false,
      message: 'exist data',
    });
  }

  await QUERY`INSERT INTO user (
    id,
    password,
    name,
    age,
    gender
  ) VALUES (
    ${id},
    ${password},
    ${name},
    ${age},
    ${gender}
  )`.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'register succeed',
  });
};

export const login = async (req, res) => {
  const { id, password } = req.body;

  const [user] = await findByUserId(id).catch(catchDBError(res));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  if (user.password != password) {
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

export const patch_user = async (req, res) => {
  const { id, current_password, password, name, age, gender } = req.body;

  const [user] = await findByUserId(id).catch(catchDBError(res));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  if (user.password != current_password) {
    return res.status(412).json({
      success: false,
      message: 'patch failed',
    });
  }

  await QUERY`
    UPDATE user 
      SET 
        name = ${name},
        password = ${password},
        age = ${age},
        gender = ${gender}
      WHERE pk = ${user.pk}
  `.catch(catchDBError(res));

  return res.json({
    success: true,
    message: 'patch succeed',
  });
};

export const delete_user = async (req, res) => {
  const { id, password } = req.body;

  const [user] = await findByUserId(id).catch(catchDBError(res));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'not found user',
    });
  }

  if (user.password != password) {
    return res.status(412).json({
      success: false,
      message: 'delete failed',
    });
  }

  await QUERY`
    DELETE FROM user
      WHERE pk = ${user.pk}
  `.catch(catchDBError(res));

  return res.json({
    success: false,
    message: 'delete succeed',
  });
};
