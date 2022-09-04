import { QueryResult } from 'pg';

import { query } from '../../database';

type WordRow = {
    id: number;
    name: string;
    description: string;
};

const getWords = async () => {
    try {
        const response: QueryResult<WordRow> = await query<WordRow>(`SELECT * FROM words;`);
        return response.rows;
    } catch (err){
        console.log(err);
    }
};

export default getWords;
