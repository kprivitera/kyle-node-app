import { query } from '../../database';

const getAllUsers = async () => {
    const result = await query('SELECT id, username, email FROM users');
    return result.rows;
}

const getSingleUser = async (id: string) => {
    const values = [id];
    const result = await Promise.all([
        query(
        'SELECT id, username, email, first_name, last_name FROM users WHERE id = $1',
        values,
        ),
        query(
            `
                SELECT users.id, username, email, first_name, last_name
                FROM users 
                INNER JOIN user_friends 
                ON users.id = user_friends.friend_id 
                WHERE user_id = $1`,
            values,
        ),
    ]);
    const databaseResult = await query(
        'SELECT id, username, email, first_name, last_name, image_url FROM users WHERE id = $1',
        values,
    );
    return databaseResult.rows;
}

const createUsers = async (novel) => {
    const values = [novel.title, novel.description, novel.image];
    const text = 'INSERT INTO users (title, description, image) VALUES ($1, $2, $3)';
    const result = await query(text, values);
    return result.rows;
}

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
  }

const deleteUsers = async (id) => {
    const novelID = parseInt(id);
    const text = 'DELETE FROM users WHERE id= $1';
    const values = [novelID];
    const result = await query(text, values);
    return result.rows;
}

export { 
    getAllUsers,
    getSingleUser,
    createUsers,
    updateUsers,
    deleteUsers
};
