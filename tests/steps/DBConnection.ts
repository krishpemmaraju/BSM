import { Given, Then } from "@cucumber/cucumber";
import DBConnection from "../../src/db/DBConnection";
import * as data from "../../src/config/env/envDetails.json"



         let connection=null;
         let connectionHJ=null;
         Given('User Connect to DB', async function () {
             connection = await new DBConnection().connectToDB(data.ODS_STG[0].DBTYPE,data.ODS_STG[0].ODSSTGUSERNAME,data.ODS_STG[0].ODSPASSWORD,data.ODS_STG[0].ODSALIAS);
             connectionHJ = await new DBConnection().connectToDB(data.HIGHJUMP_STG[0].DBTYPE,data.HIGHJUMP_STG[0].HJSTGUSERNAME,data.HIGHJUMP_STG[0].HJPASSWORD,data.HIGHJUMP_STG[0].HJALIAS);
            });


         Then('User should see the successful connect message', async function () {
            const getHeaders = await new DBConnection().getColumnHeaders("SELECT * FROM ods_lookups WHERE LKP_SK = '134452'");
            const result = await new DBConnection().executeQuery("SELECT * FROM ods_lookups WHERE LKP_SK = '134452'");
       //     const HJresult = await connectionHJ.execute("SELECT store_order_number FROM si_order where store_order_number = 'CC/139001986' and customer_name='CC Branch'")
            // console.log((await new DBConnection().getQueryResultWithHeaders("SELECT * FROM ods_lookups WHERE LKP_SK = '134452'")));
            // console.log((await new DBConnection().getQueryResultWithColumnName("SELECT * FROM ods_lookups WHERE LKP_SK = '134452'","FULL_DESCRIPTION")).join().trim());

       //     await new DBConnection().writeTableResultsToCSVFile("SELECT * FROM ods_lookups","./src/data/ResultsData.xlsx",'xlsx');
            let queries = ['SELECT * FROM ods_lookups','select * from ods_add_stock_lengths'];
            await new DBConnection().writeMulQueryResultsToFile(queries,"./src/data/",'xlsx');
         });