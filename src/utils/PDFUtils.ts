import pdfParse from "pdf-parse";
import fs from "fs";

export default class PDFUtils { 


        /**
     * Gets the text content of the pdf file
     * @param filePath File path
     * @returns PDF as text
     */

    public static async getText(filePath:string): Promise<string> {
        const getData = fs.readFileSync(filePath);
        try{
            const data = await pdfParse(getData);
            return data.text;
        }catch(err){
            throw new Error(err);
        }
    }

      /**
     * Gets the number of pages from the pdf file
     * @param filePath File path
     * @returns PDF as text
     */

      public static async getNoOfPageFromPDF(filePath:string): Promise<string> {
        const getData = fs.readFileSync(filePath);
        try{
            const data = await pdfParse(getData);
            return data.numpages;
        }catch(err){
            throw new Error(err);
        }
    }
}