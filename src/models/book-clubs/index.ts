import _ from "lodash";
import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";

const createBookClub = async (
  name: string,
  description: string,
  theme: string,
  userId?: number
) => {
  const values = [name, description, theme];
  const text =
    "INSERT INTO book_clubs (name, description, theme) VALUES ($1, $2, $3) RETURNING *;";
  try {
    const bookClubResult = await query(text, values);

    const clubId = bookClubResult.rows[0].id;
    const insertMemberText =
      "INSERT INTO club_members (user_id, book_club_id, joined_at) VALUES ($1, $2, NOW()) RETURNING *;";
    const memberValues = [userId, clubId];
    const result = await query(insertMemberText, memberValues);
    console.log("result", result.rows[0]);

    return convertResultToCamelcase(result.rows[0]);
  } catch (error) {
    console.log("error", error);
  }
};

const getAllBookClubs = async () => {
  const result = await query(
    "SELECT id, name, description, theme, created_at, updated_at FROM book_clubs"
  );
  console.log("result", result.rows);
  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
};

const getAllBookClubsForUser = async (userId: number) => {
  const values = [userId];
  const result = await query(
    `SELECT book_clubs.id, name, description, theme, created_at, updated_at 
    FROM book_clubs 
    JOIN club_members ON book_clubs.id = club_members.book_club_id 
    WHERE club_members.user_id = $1`,
    values
  );

  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
};

const getBookClubById = async (userId: number) => {
  const values = [userId];
  const result = await query(
    "SELECT id, name, description, theme, created_at, updated_at FROM book_clubs WHERE id = $1",
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

const getBookClubMembers = async (bookClubId: number) => {
  const values = [bookClubId];
  try {
    const result = await query(
      `
      SELECT users.id, users.first_name, users.last_name, users.profile_image, users.username  
      FROM club_members
      JOIN users on club_members.user_id = users.id
      WHERE club_members.book_club_id = $1
    `,
      values
    );
    const rowsWithCamelCase = _.map(result.rows, (user) =>
      convertResultToCamelcase(user)
    );
    return rowsWithCamelCase;
  } catch (error) {
    console.log(error);
  }
};

const getBookClubBooks = async (bookClubId: number) => {
  const values = [bookClubId];
  const result = await query(
    `
    SELECT books.id  
    FROM club_books 
    JOIN books on club_books.book_id = books.id
    WHERE club_books.book_club_id = $1
  `,
    values
  );
  const rowsWithCamelCase = _.map(result.rows, (book) => book.id);
  console.log(rowsWithCamelCase);
  return rowsWithCamelCase as number[];
};

// Note the table restricts a member from joining a club more than once
const addClubMember = async ({
  bookClubId,
  userId,
}: {
  bookClubId: number;
  userId: number;
}) => {
  const values = [userId, bookClubId];
  const text = `INSERT INTO club_members (user_id, book_club_id) VALUES ($1, $2)`;
  try {
    const result = await query(text, values);
    console.log("result", result.rows[0]);
  } catch (error) {
    // @TODO:handle duplicate member error
    console.log("addClubMember::error", error);
  }
};

const editBookClub = async ({
  bookClubId,
  description,
  name,
  theme,
}: {
  bookClubId: number;
  description: string;
  name: string;
  theme: string;
}) => {
  const values = [bookClubId, description, name, theme];
  const text = `
    UPDATE book_clubs
    SET description = $2, name = $3, theme = $4
    WHERE id = $1;
  `;
  try {
    const result = await query(text, values);
    console.log("result", result.rows[0]);
  } catch (error) {
    // @TODO:handle duplicate member error
    console.log("addClubMember::error", error);
  }
};

const removeClubMember = async ({
  bookClubId,
  userId,
}: {
  bookClubId: number;
  userId: number;
}) => {
  const values = [userId, bookClubId];
  const text = `DELETE FROM club_members WHERE user_id = $1 and book_club_id = $2;`;
  try {
    const result = await query(text, values);
    return result.rows;
  } catch (error) {
    console.log("addClubMember::error", error);
  }
};

const removeClubBook = async ({
  bookClubId,
  bookId,
}: {
  bookClubId: number;
  bookId: number;
}) => {
  const values = [bookId, bookClubId];
  console.log("values", values);
  const text = `DELETE FROM club_books WHERE book_id = $1 and book_club_id = $2;`;
  try {
    const result = await query(text, values);
    console.log("result", result);
    return result.rows;
  } catch (error) {
    console.log("addClubMember::error", error);
  }
};

export {
  addClubMember,
  createBookClub,
  editBookClub,
  getAllBookClubs,
  getAllBookClubsForUser,
  getBookClubById,
  getBookClubBooks,
  getBookClubMembers,
  removeClubMember,
  removeClubBook,
};
