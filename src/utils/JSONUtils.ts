import * as fs from 'fs'

export default class JSONUtils {

    public static async writeDataToJSONFile(filePath: string, data: any) {
        try {
            const jsonString = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonString, 'utf-8');
        }
        catch (error) {
            console.error('Error writing to the file', error);
            throw error;
        }
    }

    static async appendToJSONArray<T>(filePath: string, data: T): Promise<void> {
        try {
            let existingData: T[] = [];
            if (fs.existsSync(filePath)) {
                const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                try {
                    if(Array.isArray(JSON.parse(fileContent))){
                        existingData = JSON.parse(fileContent);
                    }else{
                        console.log("coming here as above is not an array")
                        existingData = []
                    }
                } catch (parseError) {
                    console.error('JSON File Not available , updating empty array');
                    existingData = [];
                }

                if (!Array.isArray(existingData)) {
                    existingData = [];
                }


                existingData.push(data);
                await fs.promises.writeFile(filePath, JSON.stringify(existingData, null, 2) + '\n', 'utf8');
                console.log('data updated fine')
            }
        } catch (error) {
            console.log('Issue while uploading data to JSON file', error);
            throw error;
        }
    }

    static async WriteJsonFileNotArray(filePath: string,key: string,value: any):Promise<void> {
        try{
        let existingData : {[key: string] : any} = {};

         if(fs.existsSync(filePath)){
            const fileContent = await fs.promises.readFile(filePath,'utf-8');

            if(fileContent.trim()){
                try{
                    const parseData = JSON.parse(fileContent);
                   
                    if( typeof parseData == 'object' && !Array.isArray(parseData) && parseData !== null){
                        existingData = parseData;
                    }else{
                        console.log('File Contains Empty Object');
                        existingData= {}
                    }

                }catch(parseError){
                    console.warn('File content is not an Object');
                    existingData = {}
                }
            }
         }

         if(existingData.hasOwnProperty(key)){
            console.log('Key already Available');
            return;
         }

         existingData[key] = value;
         const formattedJsonData = JSON.stringify(existingData,null,2);
         await fs.promises.writeFile(filePath,formattedJsonData+ '\n', 'utf8');
         console.log("Data added as a Object");
        }catch(error){
            console.warn("Issue while wrting to the JSON file" , error);
        }
    }

    public static async getJsonValueFromResponse(response: any, propertyValue: string){
        const quantities: any[] = [];
        JSON.stringify(response, (key, value) => {
            if( key == propertyValue){
                quantities.push(value);
            }
            return value;
        });
        return quantities;
    }
}

