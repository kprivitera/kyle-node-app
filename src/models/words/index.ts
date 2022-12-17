import { QueryResult } from 'pg';

import { query } from '../../database';

type WordRow = {
    id: number;
    name: string;
    description: string;
};

const getWords = async ({ itemsByPage, page }: { itemsByPage: number, page: number }) => {
    const offset = (page - 1) * itemsByPage;

    try {
        const values = [itemsByPage, offset];
        const response: QueryResult<WordRow> = await query<WordRow, number>(`SELECT * FROM words ORDER BY name asc LIMIT $1 OFFSET $2;`, values);
        return response.rows;
    } catch (err){
        console.log(err);
    }
};

export default getWords;
