
import { Snowflake } from 'snowflake-promise';
import * as dotenv from 'dotenv';

export const snowflakeConn = {
  provide: 'SNOWFLAKE',
  useFactory: () => {
    const conn = new Snowflake(
      {
        account: dotenv.config().parsed.DB_ACC,
        username: dotenv.config().parsed.DB_USER,
        password: dotenv.config().parsed.DB_PASS,
        warehouse: dotenv.config().parsed.DB_WARE,
        database: dotenv.config().parsed.DB_NAME,
        schema: dotenv.config().parsed.DB_SCHEMA,
      },
      // {
      //   logLevel: 'trace', // maximum SDK logLevel
      //   logSql: console.log, // SQL statements will be logged to the console
      // },
    );

    conn.connect();

    return conn;
  },
};

