import pg, { QueryResult } from 'pg';

const { Client } = pg;

const makeDatabaseConnection = (): pg.Client  => {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: Number(process.env.DB_PORT),
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    client.connect();
    return client;
};

const query = async <T = Record<string, unknown>, U = []>(
    sql: string, 
    args?: Array<U>
): Promise<QueryResult<T>> => {
    const client: pg.Client = makeDatabaseConnection();
    try {
        const result: QueryResult<T> = await client.query<T>(sql, args);  
        client.end();
        return result;
    } catch (error) {
        client.end();
        throw error;
    }
};

export {
    makeDatabaseConnection,
    query
};
