import _ from "lodash";
import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";

const createBookClub = async (
  name: string,
  description: string,
  theme: string
) => {
  const values = [name, description, theme];
  const text =
    "INSERT INTO book_clubs (name, description, theme) VALUES ($1, $2, $3) RETURNING *;";
  try {
    const result = await query(text, values);
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

const getBookClubById = async (id: number) => {
  const values = [id];
  const result = await query(
    "SELECT id, name, description, theme, created_at, updated_at FROM book_clubs WHERE id = $1",
    values
  );
  return convertResultToCamelcase(result.rows[0]);
};

export { createBookClub, getAllBookClubs, getBookClubById };
