import { QueryResult } from "pg";
import _ from "lodash/fp";

import { query } from "../../database";

type Word = {
  name: string;
  description: string;
};

type WordRow = Word & {
  id: number;
};

const getWords = async ({
  itemsByPage,
  page,
  letter,
}: {
  itemsByPage: number;
  page: number;
  letter: string;
}) => {
  // the like is set like this because you cant wrap it with single quotes because the string will be taken
  // literally like this: LIKE '$1%'. You cant also use double quotes. Instead we You should not use double quotes
  // around the parameter placeholder, but rather concatenate it with the percentage sign.
  const offset = (page - 1) * itemsByPage;
  try {
    const values = [letter, itemsByPage, offset];
    const response: QueryResult<WordRow> = await query<
      WordRow,
      number | string
    >(
      `
      SELECT * FROM words
      WHERE lower (name) LIKE $1 || '%'
      ORDER BY name asc
      LIMIT $2 OFFSET $3;`,
      values
    );
    return response.rows;
  } catch (err) {
    console.log(err);
  }
};

const getWord = async ({ id }: { id: number }) => {
  console.log(id);
  const values = [id];
  const text = `SELECT * FROM words where id = $1`;
  try {
    const result = await query(text, values);
    return _.get("rows[0]", result);
  } catch (error) {
    console.log(error);
  }
};

const createWord = async ({ name, description }: Word) => {
  console.log("createWord", name, description);
  const values = [name, description];
  const text = "INSERT INTO words (name, description) VALUES ($1, $2)";
  try {
    const result = await query(text, values);
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const updateWord = async (input: WordRow) => {
  const text = `
    UPDATE words 
    SET name = $1, description = $2
    WHERE id = $3
  `;
  const values = [input.name, input.description, input.id];
  const result = await query(text, values);
  return result;
};

const deleteWord = async (id: number) => {
  const text = "DELETE FROM words WHERE id= $1";
  const values = [id];
  await query(text, values);
  return id;
};

export { getWord, getWords, createWord, updateWord, deleteWord };
