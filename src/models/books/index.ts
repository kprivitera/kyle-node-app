import _ from "lodash";
import { map, set } from "lodash/fp";

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

const makeReview = async (review: string, bookId: number, userId: number) => {
  const values = [userId, bookId, review];
  const text =
    "INSERT INTO book_reviews (user_id, book_id, review) VALUES ($1, $2, $3) RETURNING id;";
  try {
    const result = await query(text, values);
    return result.rows[0].id;
  } catch (error) {
    console.log("error", error);
  }
};

const makeRatingAndReview = async (
  bookId: number,
  userId: number,
  rating: number,
  review: string
) => {
  try {
    if (rating) {
      await makeRating(bookId, userId, rating);
    }
    const reviewId = await makeReview(review, bookId, userId);
    return reviewId;
  } catch (error) {
    console.log(error);
  }
};

const getBookReviews = async (bookId: number, userId?: number) => {
  const values = [bookId];

  let queryText = `SELECT book_reviews.id, review, book_reviews.timestamp, users.first_name, users.last_name, users.profile_image, users.username, book_ratings.rating,
     ARRAY_AGG(json_build_object('id', review_comments.id, 'comment', comment, 'timestamp', review_comments.timestamp, 'username', commenters.username, 'profile_image', commenters.profile_image)) AS comments     FROM book_reviews
     JOIN users ON book_reviews.user_id = users.id
     JOIN book_ratings ON book_reviews.user_id = book_ratings.user_id AND book_reviews.book_id = book_ratings.book_id
     LEFT JOIN review_comments ON book_reviews.id = review_comments.review_id
     LEFT JOIN users AS commenters ON review_comments.user_id = commenters.id
     WHERE book_reviews.book_id = $1`;

  if (userId) {
    queryText += " AND book_reviews.user_id != $2";
    values.push(userId);
  }

  queryText +=
    " GROUP BY book_reviews.id, users.first_name, users.last_name, users.profile_image, users.username, book_ratings.rating";

  try {
    const result = await query(queryText, values);
    // console.log(result.rows[0]);
    const rowsWithCamelCase = _.map(result.rows, (user) =>
      convertResultToCamelcase(user)
    );
    console.log(rowsWithCamelCase[0]);
    return rowsWithCamelCase;
  } catch (error) {
    console.log("error", error);
  }
};

const getUserReview = async (bookId: number, userId: number) => {
  const values = [bookId, userId];

  try {
    const result = await query(
      `SELECT book_reviews.id, review, timestamp, users.first_name, users.last_name, users.profile_image, users.username, book_ratings.rating 
       FROM book_reviews
       JOIN users ON book_reviews.user_id = users.id
       JOIN book_ratings ON book_reviews.user_id = book_ratings.user_id AND book_reviews.book_id = book_ratings.book_id
       WHERE book_reviews.book_id = $1 AND users.id = $2;`,
      values
    );
    const rowsWithCamelCase = _.map(result.rows, (user) =>
      convertResultToCamelcase(user)
    );
    return rowsWithCamelCase[0];
  } catch (error) {
    console.log("error", error);
  }
};

const makeComment = async (
  comment: string,
  reviewId: number,
  userId: number
) => {
  const values = [userId, reviewId, comment];
  const text =
    "INSERT INTO review_comments (user_id, review_id, comment) VALUES ($1, $2, $3) RETURNING id;";
  try {
    const result = await query(text, values);
    return result.rows[0].id;
  } catch (error) {
    console.log("error", error);
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
  makeReview,
  getBookReviews,
  makeRatingAndReview,
  getUserReview,
  makeComment,
};
