import _ from "lodash";

import { query } from "../../database";
import convertResultToCamelcase from "../../utils/convert-result-to-camelcase";

const getAllBooks = async () => {
  const result = await query(
    "SELECT id, title, description, page_count, author_id FROM books"
  );
  const rowsWithCamelCase = _.map(result.rows, (user) =>
    convertResultToCamelcase(user)
  );
  return rowsWithCamelCase;
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

export { getAllBooks, getAllAuthors, getAuthorById };
