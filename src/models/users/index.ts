import _ from 'lodash';

import { query } from '../../database';
import convertResultToCamelcase from '../../utils/convert-result-to-camelcase';

type InputUser = {
    id: number,
    username: string,
    email: string,
    firstName: string,
    lastName: string
};

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

const createUser = async (input: InputUser) => {
    const values = [input.firstName, input.lastName, input.email, input.username];
    const text = 'INSERT INTO users (first_name, last_name, email, username) VALUES ($1, $2, $3, $4)';
    const result = await query(text, values);
    return result.rows;
};

const updateUser = async (input: InputUser) => {
    const text =
    `UPDATE users 
    SET username = $1, first_name = $2, last_name = $3, email = $4 
    WHERE id = $5`;
    const values = [
        input.username,
        input.firstName,
        input.lastName,
        input.email,
        input.id,
    ];
    console.log('values', values);
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
    createUser,
    updateUser,
    deleteUser
};
