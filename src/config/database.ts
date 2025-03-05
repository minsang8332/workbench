import path from 'path'
import Database from 'better-sqlite3'
import Knex from 'knex'
import { getAppData } from '@/utils/common'
export class SqliteDatabase {
    private static _database: string = 'workbench.db'
    private static _instance: Database.Database
    private static _path: string
    private static _mapper?: Knex.Knex
    static connect() {
        return new Promise((resolve) => {
            if (!SqliteDatabase._instance) {
                SqliteDatabase._path = path.join(getAppData('datasource'))
                SqliteDatabase._instance = new Database(path.join(SqliteDatabase._path, SqliteDatabase._database))
                // 성능 최적화
                SqliteDatabase._instance.pragma('journal_mode = WAL')
            }
            resolve(SqliteDatabase._instance)
        })
    }
    static useKnex() {
        SqliteDatabase._mapper = Knex({
            client: 'better-sqlite',
            connection: {
                filename: path.join(SqliteDatabase._path, SqliteDatabase._database),
            },
            useNullAsDefault: true,
        })
    }
    getInstance() {
        return SqliteDatabase._instance
    }
    getMapper() {
        return SqliteDatabase._mapper
    }
}
