import { createConnection } from 'typeorm';

export default (async () => await createConnection());


/* import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database: defaultOptions.database,
    })
  );
}; */
