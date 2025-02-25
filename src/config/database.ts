import path from 'path'
import { getAppData } from '@/utils/common'
import Database from 'better-sqlite3'
export class SqliteDatasource {
    private static _datasource: Database.Database
    private static _path: string
    // private static _mapper?: Sequelize
    static connect() {
        if (!SqliteDatasource._datasource) {
            SqliteDatasource._path = path.join(getAppData('datasource'))
            SqliteDatasource._datasource = new Database(path.join(SqliteDatasource._path, 'workbench.db'))
            // 성능 최적화
            SqliteDatasource._datasource.pragma('journal_mode = WAL')
        }
        return SqliteDatasource._datasource
    }
    /*
    static useSequelize() {
        SqliteDatasource._mapper = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(SqliteDatasource._path, 'workbench.db'),
            logging: true,
        })
        SqliteDatasource._mapper.authenticate()
    }
    */
}
