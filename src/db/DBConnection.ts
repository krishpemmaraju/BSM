import oracledb, { outFormat } from 'oracledb'
import { title } from 'process';
import { createObjectCsvWriter } from 'csv-writer'
import ExcelJS from 'exceljs'
import path from 'path';


export default class DBConnection {
    public async connectToDB(dbType: string, dbUsername: string, dbPassword: string, dbAlias: string): Promise<oracledb.Connection | null> {
        let connection: oracledb.Connection| null = null;
        switch (dbType) {

            case 'ODS':
                try {
                    oracledb.autoCommit = true;
                    connection = await oracledb.getConnection({
                        user: dbUsername,
                        password: dbPassword,
                        connectString: dbAlias
                    });
                    console.log("Connected")
                    return connection;
                } catch (error) {
                    if (error instanceof Error) {
                        console.log("Not connected: " + error.message);
                    } else {
                        console.log("Not connected: " + error);
                    }

                }
            case 'HJ':
                try {
                    oracledb.autoCommit = true;
                    const connection = await oracledb.getConnection({
                        user: dbUsername,
                        password: dbPassword,
                        connectString: dbAlias
                    });
                    console.log("Connected")
                    return connection;
                } catch (error) {
                    if (error instanceof Error) {
                        console.log("Not connected: " + error.message);
                    } else {
                        console.log("Not connected: " + error);
                    }
                }
            default:
                return null;
          
        }

    }
    public async executeQuery(connection: oracledb.Connection,queryToExecute: string) {
        const results = await connection.execute(queryToExecute);
        return results;
    }

    public async getColumnHeaders(connection: oracledb.Connection,queryToExecute: string) {
        const result = await connection.execute(queryToExecute, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        })
        const headers = result.metaData?.map(col => col.name) ?? [];
        return headers;
    }

    public async getQueryResultWithHeaders(connection: oracledb.Connection,queryToExecute: string) {
        let rowValues:any;
        const allRows: string[] = [];
        const result = await connection.execute(queryToExecute, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        })
        let headers = result.metaData?.map(col => col.name) ?? [];
        for (const row of (result.rows ?? []) as Record<string,any>[]) {
            rowValues = headers.map(header => row[header]);
            allRows.push(rowValues)
            console.log(rowValues.join('|'))
        }
        return {
            rows: result.rows ?? []
        }
    }

    public async getQueryResultWithColumnName(connection: oracledb.Connection,queryToExecute: string, colName: string): Promise<any> {
        const result = await connection.execute(queryToExecute, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        })
        await connection.close();

        return (result.rows ?? []).map(row => (row as Record<string,any>)[colName]);
    }

    public async writeTableResultsToCSVFile(connection: oracledb.Connection,queryToExecute: string, filePaths: string, fileType: string) {
        let header: { id: string, title: string }[];
        let result: any;
        result = await connection.execute(queryToExecute, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        })
        await connection.close();
        const rows = result.rows ?? [];

        switch (fileType) {
            case 'csv':
                if (rows.length == 0) {
                    header = [{ id: 'Data', title: 'Not available' }];
                    const csvWriter = createObjectCsvWriter({
                        path: path.resolve(filePaths),
                        header: header,
                    });
                    await csvWriter.writeRecords(rows);
                } else {
                    header = Object.keys(rows[0]).map(key => ({ id: key, title: key }));
                    const csvWriter = createObjectCsvWriter({
                        path: path.resolve(filePaths),
                        header: header,
                    });
                    await csvWriter.writeRecords(rows);
                }
            case 'xlsx':
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Results');
                if (rows.length == 0) {
                    worksheet.addRow(['No data Available'])
                }
                else {
                    const headers = Object.keys(rows[0]);
                    worksheet.columns = headers.map(header => ({
                        header,
                        key: header,
                        width: 20
                    }));
                    (rows as Record<string,any>[]).forEach(row => {
                        worksheet.addRow(row);
                    })
                    const filePath = path.resolve(filePaths);
                    await workbook.xlsx.writeFile(filePath);
                }
        }
    }

    public async attemptQueryForResults(connection: oracledb.Connection,retries:number,queryToExecute:string,delayInMS:number){
        let attempt =0;
        while( attempt < retries){
            attempt++;
            const results = await new DBConnection().getQueryResultWithHeaders(connection, queryToExecute);
            if( results.rows && results.rows.length > 0){
                return results;
            }
            console.log(` No results found yet - polling ${queryToExecute} for attempt ${attempt} - trying in ${delayInMS} milli seconds`)
            await new Promise(resolve => setTimeout(resolve, delayInMS));
        }
      throw new Error(`No results found after ${retries} attempts`)
    }

    public async writeMulQueryResultsToFile(connection: oracledb.Connection,queries: string[], filePath: string, fileType: string) {
        let results: any;
        let i = 0;
        let workbook: any;
        let pathFile: any;
        let rows: any;
        if (fileType === 'xlsx' || fileType === 'xls') {
            workbook = new ExcelJS.Workbook();
        }
        let headerValues: { id: string, title: string }[];
        for (let s of queries) {
            i++;
            results = await connection.execute(s, [], {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            })

            switch (fileType) {
                case 'csv': {
                    rows = results.rows ?? [];
                    if (rows.length != 0) {
                        headerValues = Object.keys(rows[0]).map(key => ({ id: key, title: key }));
                        const csvWriter = createObjectCsvWriter({
                            path: path.resolve(filePath + 'resultQuery_' + i + '.csv'),
                            header: headerValues
                        })
                        await csvWriter.writeRecords(rows);
                    }
                    break;
                }

                case 'xlsx': {
                    if (!workbook) break;
                    rows = results.rows ?? [];
                    const worksheet = workbook.addWorksheet('ResultsQuery_' + i);
                    const headers = Object.keys(rows[0])
                    worksheet.columns = headers.map(header => ({
                        header,
                        key: headers,
                        width: 20

                    }));
                    (rows as Record<string,any>[]).forEach(row => {
                        worksheet.addRow(row)
                    })
                    await workbook.xlsx.writeFile(path.resolve(filePath) + '/MultipleResultsQuery.xlsx')
                    break;
                }
                default:
                    console.warn(`Unsupported file type: ${fileType}`);
            }
        }
        // if (fileType === 'xlsx' || fileType === 'xls') {
        // await workbook.xlsx.writeFile(path.resolve(filePath)+'/MultipleResultsQuery.xlsx') }
        await connection.close()
    }
}