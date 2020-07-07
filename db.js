import { MySQL } from 'fxsql';

const { CONNECT } = MySQL;

export const POOL = CONNECT({
  host: 'localhost',
  user: 'root',
  password: 'asdf1234',
  database: 'fxjs',
});
