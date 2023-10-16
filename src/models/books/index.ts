import _ from "lodash";

import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";
import convertResultToCamelcaseArray from "../../utils/convert-result-to-camelcase-array";

const getAllBooks = async () => {
  const result = await query(
    "SELECT id, title, description, page_count, author_id, cover_image FROM books"
  );
  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
};

const getBookById = async (id: number) => {
  const values = [id];
  const result = await query(
    "SELECT id, title, description, page_count, author_id, cover_image FROM books where id = $1",
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

const getAllAuthors = async () => {
  const result = await query(
    "SELECT id, first_name, last_name, description, image FROM authors"
  );
  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
};

const getAuthorById = async (id: number) => {
  const values = [id];
  const result = await query(
    "SELECT id, first_name, last_name, description, image FROM authors WHERE id = $1",
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

const getGenresByBook = async (bookId: number) => {
  const values = [bookId];
  const result = await query(
    `SELECT genres.id, genres.title, genres.description
     FROM book_genres
     JOIN genres ON book_genres.genre_id = genres.id
     WHERE book_genres.book_id = $1;`,
    values
  );

  return convertResultToCamelcaseArray(result.rows);
};

const getBookSeries = async (bookId: number) => {
  const values = [bookId];
  const result = await query(
    `SELECT bs.series_number, s.title, s.description
     FROM book_series bs
     JOIN series s ON bs.series_id = s.id
     WHERE bs.book_id = $1;`,
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

const getBookRatings = async (bookId: number) => {
  console.log(bookId);
  const values = [bookId];
  try {
    const result = await query(
      `SELECT 
        book_id, 
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) as count
      FROM 
        book_ratings
      WHERE
        book_id = $1
      GROUP BY 
        book_id;`,
      values
    );
    const { averageRating, count } = convertResultToCamelcase(result.rows[0]);
    return { averageRating, count };
  } catch (error) {
    console.log(error);
  }
};

export {
  getAllBooks,
  getAllAuthors,
  getAuthorById,
  getBookById,
  getGenresByBook,
  getBookSeries,
  getBookRatings,
};
