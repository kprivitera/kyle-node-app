import _ from "lodash";

import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";

type InputUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

const getAllUsers = async () => {
  const result = await query(
    "SELECT id, username, email, first_name, last_name FROM users"
  );
  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
};

const getSingleUser = async (id: string) => {
  const values = [id];
  const result = await query(
    "SELECT id, username, email, first_name, last_name FROM users WHERE id = $1",
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

const createUser = async (input: InputUser) => {
  const values = [input.firstName, input.lastName, input.email, input.username];
  const text =
    "INSERT INTO users (first_name, last_name, email, username) VALUES ($1, $2, $3, $4)";
  const result = await query(text, values);
  return result.rows;
};

const updateUser = async (input: InputUser) => {
  const text = `
        UPDATE users 
        SET username = $1, first_name = $2, last_name = $3, email = $4 
        WHERE id = $5
    `;
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
  const text = "DELETE FROM users WHERE id= $1";
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
  const rowsWithCamelCase = _.map(result.rows, (friend) =>
    convertResultToCamelcase(friend)
  );
  return rowsWithCamelCase;
};

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
  const rowsWithCamelCase = _.map(result.rows, (friend) =>
    convertResultToCamelcase(friend)
  );
  return rowsWithCamelCase;
};

// Check if friend has been added or request pending, if not add friend
const sendFriendRequest = async (userId: string, friendId: string) => {
  const text = `
        INSERT INTO user_friend_requests(sender_id, recipient_id, status)
        SELECT $1, $2, 1 WHERE (
            NOT EXISTS (SELECT * FROM user_friends WHERE user_id = $1 and friend_id = $2) 
            AND NOT EXISTS (SELECT * FROM user_friend_requests WHERE sender_id = $1 and recipient_id = $2)
        );`;
  const values = [userId, friendId];
  const result = await query(text, values);
  return result.rowCount;
};

// The friend request will be removed from friend request table and a record will be added to friends
const acceptFriendRequest = async (friendRequestId: string) => {
  const text = `
        WITH friend_request AS (
            UPDATE user_friend_requests
            SET status = 2
            WHERE id = $1
            RETURNING sender_id, recipient_id
        )
        INSERT INTO user_friends (user_id, friend_id) 
            SELECT sender_id, recipient_id FROM friend_request
        `;
  const values = [friendRequestId];
  const result = await query(text, values);
  return result.rowCount;
};

const rejectFriendRequest = async (friendRequestId: string) => {
  const text = `
        UPDATE user_friend_requests
        SET status = 3
        WHERE id = $1
        RETURNING sender_id, recipient_id`;
  const values = [friendRequestId];
  const result = await query(text, values);
  return result.rowCount;
};

const getUserByCredentials = async (
  username: string,
  password: string
): Promise<{ id: number }> => {
  const text = `
        SELECT id 
        FROM users 
        WHERE username = $1 AND password = $2;`;
  const values = [username, password];
  const result = await query(text, values);
  const user = _.head(result.rows) as { id: number };
  return user;
};

const searchUsers = async (searchTerm: string, currentUserId: number) => {
  console.log(searchTerm, currentUserId);
  const text = `
    SELECT users.*, 
      CASE 
        WHEN user_friend_requests.status IS NOT NULL THEN user_friend_requests.status
        WHEN user_friends.user_id IS NOT NULL THEN 2
        ELSE 0
      END AS friend_status
    FROM users
    LEFT JOIN user_friend_requests 
      ON users.id IN (user_friend_requests.recipient_id, user_friend_requests.sender_id)
      AND $2 IN (user_friend_requests.sender_id, user_friend_requests.recipient_id)
    LEFT JOIN user_friends 
      ON (users.id = user_friends.user_id AND user_friends.friend_id = $2)
      OR (users.id = user_friends.friend_id AND user_friends.user_id = $2)
    WHERE (users.username ILIKE $1
    OR users.email ILIKE $1
    OR (users.first_name || ' ' || users.last_name) ILIKE $1)
    AND users.id != $2
    `;
  const values = [`%${searchTerm}%`, currentUserId];
  try {
    const result = await query(text, values);
    console.log(result.rows);
    const rowsWithCamelCase = _.map(result.rows, (friend) =>
      convertResultToCamelcase(friend)
    );

    return rowsWithCamelCase;
  } catch (error) {
    console.log(error);
  }
};

export {
  acceptFriendRequest,
  createUser,
  deleteUser,
  getAllUsers,
  getFriendRequests,
  getUserByCredentials,
  getSingleUser,
  getUsersFriends,
  rejectFriendRequest,
  sendFriendRequest,
  updateUser,
  searchUsers,
};
