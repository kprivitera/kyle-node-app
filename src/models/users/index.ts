import _ from 'lodash';

import { query } from '../../database';
import convertResultToCamelcase from '../../utils/convert-result-to-camelcase';

type User = {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string
};

const getAllUsers = async () => {
    const result = await query('SELECT id, username, email, first_name, last_name FROM users');
    const rowsWithCamelCase = _.map(result.rows, (user) => convertResultToCamelcase(user));
    return rowsWithCamelCase;
};

const getSingleUser = async (id: string) => {
    const values = [id];
    // const result = await Promise.all([
    //     query(
    //     'SELECT id, username, email, first_name, last_name FROM users WHERE id = $1',
    //     values,
    //     ),
    //     query(
    //         `
    //             SELECT users.id, username, email, first_name, last_name
    //             FROM users 
    //             INNER JOIN user_friends 
    //             ON users.id = user_friends.friend_id 
    //             WHERE user_id = $1`,
    //         values,
    //     ),
    // ]);
    const result = await query(
        'SELECT id, username, email, first_name, last_name FROM users WHERE id = $1',
        values,
    );
    return convertResultToCamelcase(_.head(result.rows));
};

const createUsers = async (user: User) => {
    const values = [user.first_name, user.last_name, user.email, user.username];
    const text = 'INSERT INTO users (title, description, image) VALUES ($1, $2, $3)';
    const result = await query(text, values);
    return result.rows;
};

const updateUsers = async (id, req, file) => {
    const text =
      'UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4, image_url = $5 where id = $6';
    const values = [
      req.body.username,
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      file,
      id,
    ];
    const result = await query(text, values);
    return result;
};

const deleteUser = async (id: string) => {
    const novelID = parseInt(id);
    const text = 'DELETE FROM users WHERE id= $1';
    const values = [novelID];
    const result = await query(text, values);
    return result.rows;
};

export { 
    getAllUsers,
    getSingleUser,
    createUsers,
    updateUsers,
    deleteUser
};
