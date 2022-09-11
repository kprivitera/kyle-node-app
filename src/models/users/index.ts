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

const getUsersFriends = async (id: string) => {
    const text = `
        SELECT users.id, username, email, first_name, last_name
        FROM users 
        INNER JOIN user_friends 
        ON users.id = user_friends.friend_id 
        WHERE user_id = $1
    `;
    const values = [id];
    const result = await query(text, values);
    const rowsWithCamelCase = _.map(result.rows, (friend) => convertResultToCamelcase(friend));
    return rowsWithCamelCase;
}

  // View all of a users friend requests
  // in the parenthesis we get back a users
  const getFriendRequests = async (id: string) => {
    const text = `
        SELECT username, first_name, last_name, email, status, sender_id
        FROM user_friend_requests 
        INNER JOIN users ON user_friend_requests.sender_id  = users.id
        WHERE recipient_id = $1 AND status = 1;
    `;
    const values = [id];
    const result = await query(text, values);
    const rowsWithCamelCase = _.map(result.rows, (friend) => convertResultToCamelcase(friend));
    return rowsWithCamelCase;
}

// Check if friend has been added or request pending, if not add friend
const sendFriendRequest = async (id: string, friendId: string) => {
    const text = `
        INSERT INTO user_friend_requests(sender_id, recipient_id, status)
        SELECT $1, $2, 1 WHERE (
            NOT EXISTS (SELECT * FROM user_friends WHERE user_id = $1 and friend_id = $2) 
            AND NOT EXISTS (SELECT * FROM friend_requests WHERE sender_id = $1 and recipient_id = $2)
        );`;
    const values = [id, friendId];
    const result = await query(text, values);
    return result.rowCount;
}

export { 
    createUser,
    deleteUser,
    getAllUsers,
    getFriendRequests,
    getSingleUser,
    getUsersFriends,
    sendFriendRequest,
    updateUser
};
