import { QueryResult } from "pg";

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
}: {
  itemsByPage: number;
  page: number;
}) => {
  const offset = (page - 1) * itemsByPage;

  try {
    const values = [itemsByPage, offset];
    const response: QueryResult<WordRow> = await query<WordRow, number>(
      `SELECT * FROM words ORDER BY name asc LIMIT $1 OFFSET $2;`,
      values
    );
    return response.rows;
  } catch (err) {
    console.log(err);
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

export { getWords, createWord, updateWord, deleteWord };
