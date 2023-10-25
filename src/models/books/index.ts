import _ from "lodash";

import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";
import convertResultToCamelcaseArray from "../../utils/convert-result-to-camelcase-array";

const getAllBooks = async () => {
  const result = await query(
    "SELECT id, title, description, page_count, author_id, cover_image FROM books ORDER BY id"
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

const getBookRatings = async (bookId: number, userId?: number) => {
  const values = [bookId, userId];

  try {
    const result = await query(
      `SELECT 
        book_id, 
        ROUND(AVG(rating), 2) as average_rating,
        COUNT(*) as count,
        BOOL_OR(user_id = $2) as has_user_rated,
        MAX(CASE WHEN user_id = $2 THEN rating END) as user_rating,
        json_build_object(
          'rating1', COUNT(CASE WHEN rating = 1 THEN 1 END),
          'rating2', COUNT(CASE WHEN rating = 2 THEN 1 END),
          'rating3', COUNT(CASE WHEN rating = 3 THEN 1 END),
          'rating4', COUNT(CASE WHEN rating = 4 THEN 1 END),
          'rating5', COUNT(CASE WHEN rating = 5 THEN 1 END)
        ) as ratings_breakdown
      FROM 
        book_ratings
      WHERE
        book_id = $1
      GROUP BY 
        book_id;`,
      values
    );
    console.log("rating", result.rows);
    const { averageRating, count, hasUserRated, userRating, ratingsBreakdown } =
      convertResultToCamelcase(result.rows[0]);
    return { averageRating, count, hasUserRated, userRating, ratingsBreakdown };
  } catch (error) {
    console.log(error);
  }
};

const searchAllBooks = async (searchTerm: string) => {
  const values = [`%${searchTerm}%`];
  try {
    const result = await query(
      `SELECT 
            books.id, 
            books.title, 
            books.description, 
            authors.first_name AS author_first_name, 
            authors.last_name AS author_last_name, 
            books.cover_image
        FROM 
            books
        JOIN 
            authors ON books.author_id = authors.id
        WHERE 
            LOWER(books.title) LIKE LOWER($1) OR 
            LOWER(CONCAT(authors.first_name, ' ', authors.last_name)) LIKE LOWER($1)
        LIMIT 5;`,
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

const makeRating = async (bookId: number, userId: number, rating: number) => {
  const values = [userId, bookId, rating];
  try {
    await query("SELECT make_rating($1, $2, $3)", values);
    return rating;
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
  makeRating,
  searchAllBooks,
};
