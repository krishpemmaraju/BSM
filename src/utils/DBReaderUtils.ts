import oracledb from "oracledb";

export default class DBUtils {
    connection: oracledb.Connection | null = null;
    constructor(sqlType: string, username: string, password: string, host: string) {
        if (sqlType === 'SQLDB') {
            this.initConnection(sqlType, username, password, host);
        }
    }

    public async initConnection(sqlType: string, username: string, password: string, host: string) {
        try{
        switch (sqlType) {
            case 'SQLDB':
                this.connection = await oracledb.getConnection({
                    user: username,
                    password: password,
                    connectString: host
                })
                 console.log('DB connected successfully');
                break;
        }
    }catch(err){
        console.error('Not connected');
    }
    }

    public async executeSelectQuery(query: string) {
        let result = await this.connection.execute(query);
        result.rows?.forEach(row => {
            console.log(row[0])
        })
    }


}