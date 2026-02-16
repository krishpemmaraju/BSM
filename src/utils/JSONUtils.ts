import * as fs from 'fs'
import { readFile } from 'fs';

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
                    if (Array.isArray(JSON.parse(fileContent))) {
                        existingData = JSON.parse(fileContent);
                    } else {
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

    static async WriteJsonFileNotArray(filePath: string, key: string, value: any): Promise<void> {
        try {
            let existingData: { [key: string]: any } = {};

            if (fs.existsSync(filePath)) {
                const fileContent = await fs.promises.readFile(filePath, 'utf-8');

                if (fileContent.trim()) {
                    try {
                        const parseData = JSON.parse(fileContent);

                        if (typeof parseData == 'object' && !Array.isArray(parseData) && parseData !== null) {
                            existingData = parseData;
                        } else {
                            console.log('File Contains Empty Object');
                            existingData = {}
                        }

                    } catch (parseError) {
                        console.warn('File content is not an Object');
                        existingData = {}
                    }
                }
            }

            if (existingData.hasOwnProperty(key)) {
                console.log('Key already Available');
                return;
            }

            existingData[key] = value;
            const formattedJsonData = JSON.stringify(existingData, null, 2);
            await fs.promises.writeFile(filePath, formattedJsonData + '\n', 'utf8');
            console.log("Data added as a Object");
        } catch (error) {
            console.warn("Issue while wrting to the JSON file", error);
        }
    }

    public static async getJsonValueFromResponse(response: any, propertyValue: string) {
        const quantities: any[] = [];
        JSON.stringify(response, (key, value) => {
            if (key == propertyValue) {
                quantities.push(value);
            }
            return value;
        });
        return quantities.length > 0 ? String(quantities[0]) : "";
    }

    public static async updateJsonFields(filePath: string, parentArray: string, updates: Record<string, any>) {
        // read the file 
        const rawJson = await fs.promises.readFile(filePath, 'utf-8');
        //parse the Josn
        const parsedJson = JSON.parse(rawJson);

        // for updating top elements

        for (const key of Object.keys(updates)) {
            if (key != parentArray && key in parsedJson) {
                parsedJson[key] = updates[key]
            }
        }

        //Get the list of child element from parent element 
        const originalChildLines = parsedJson[parentArray];
        const updateLine = updates[parentArray]?.[0];
        if (Array.isArray(originalChildLines) && originalChildLines.length > 0 && updateLine) {
            const linesToUpdate = originalChildLines[0];
            for (const key of Object.keys(updateLine)) {
                if (key in linesToUpdate) {
                    linesToUpdate[key] = updateLine[key]
                }
            }
        }
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, 'utf-8');
        return updatedJson;
    }

    public static async updateAllArraysJsonFields(filePath: string, parentArray: string, updates: Record<string, any>) {
        // read the file 
        const rawJson = await fs.promises.readFile(filePath, 'utf-8');
        //parse the Josn
        const parsedJson = JSON.parse(rawJson);

        const originalChildLines = parsedJson[parentArray];
        const updateLines = updates[parentArray];

        if (Array.isArray(originalChildLines) && Array.isArray(updateLines)) {
            for (let i = 0; i < originalChildLines.length && i < updateLines.length; i++) {
                const linesToUpdate = originalChildLines[i];
                const updateLine = updateLines[i];

                for (const key of Object.keys(updateLine)) {
                    if (key in linesToUpdate) {
                        linesToUpdate[key] = updateLine[key]
                    }
                }
            }
        }
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, 'utf-8');
        return updatedJson;
    }

    public static async updatedAllArrays(filePath: string, parentArray: string, updates: Record<string, any>) {
        const rawJson = await fs.promises.readFile(filePath, 'utf-8');
        const parsedJson = JSON.parse(rawJson)

        function updateAllArray(updArray: any) {
            if (Array.isArray(updArray)) {
                for (const item of updArray) {
                    updateAllArray(item)
                }
                return;
            }
            if (typeof updArray === 'object' && updArray != null) {
                for (const key of Object.keys(updArray)) {
                    if (key === parentArray && Array.isArray(updArray[key])) {
                        const updateArray = updates[parentArray]
                        if (Array.isArray(updateArray) && updateArray.length > 0) {
                            const updateObj = updateArray[0];
                            for (const child of updArray[key]) {
                                for (const field of Object.keys(updateObj)) {
                                    child[field] = updateObj[field]
                                }
                            }
                        }
                    }
                    updateAllArray(updArray[key])
                }
            }
        }
        updateAllArray(parsedJson);

        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, "utf-8");

        return updatedJson;

    }


    public static async UpdateMultipleArraysJson(filePath: string, parentArray: string, updates: Record<string, any>) {
        const rawJson = await fs.promises.readFile(filePath, "utf-8");
        const parsedJson = JSON.parse(rawJson);

        for (const key of Object.keys(updates)) {
            if (key != parentArray && key in parsedJson) {
                console.log('Not the parent array' + key)
                parsedJson[key] = updates[key]
            }
        }
        const originalLines = parsedJson[parentArray]
        const updateLines = updates[parentArray]

        if (Array.isArray(originalLines) && Array.isArray(updateLines)) {
            originalLines.forEach((line, index) => {
                const updateLine = updateLines[index]
                if (!updateLine) return;

                for (const key of Object.keys(updateLine)) {
                    if (key != "charges" && key in line) {
                        console.log(`from lines array - we are updating - ${updateLine[key]}`)
                        line[key] = updateLine[key]
                    }
                }

                //update second array charges
                if (updateLine.charges && Array.isArray(updateLine.charges)) {
                    line.charges.forEach((charge, cIndex) => {
                        const updateCharge = updateLine.charges[cIndex];
                        if (!updateCharge) return;

                        for (const key of Object.keys(updateCharge)) {
                            if (key != "chargeComponents" && key in charge) {
                                charge[key] = updateCharge[key]
                            }
                        }
                        // Update Second Component
                        if (
                            updateCharge.chargeComponents &&
                            Array.isArray(updateCharge.chargeComponents)
                        ) {
                            charge.chargeComponents.forEach((comp, compIndex) => {
                                const updateComp = updateCharge.chargeComponents[compIndex];
                                if (!updateComp) return;

                                Object.entries(updateComp).forEach(([key, value]) => {
                                    comp[key] = value;
                                });

                            });
                        }
                    })
                }

            })
        }
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, "utf-8");
        return updatedJson;

    }


    public static async updateJSONDataAllArrays(filePath: string, parentArray: string, updates: Record<string, any>) {
        const rawJson = await fs.promises.readFile(filePath, "utf-8");
        const parsedJson = JSON.parse(rawJson);

        for (const key of Object.keys(updates)) {
            if (key !== "lines" && key !== "chargeComponents" && key in parsedJson) {
                parsedJson[key] = updates[key];
            }
        }

        if (Array.isArray(parsedJson.lines) && Array.isArray(updates.lines)) {
            parsedJson.lines.forEach((line, index) => {
                const updateLine = updates.lines[index];
                if (!updateLine) return;

                Object.entries(updateLine).forEach(([key, value]) => {
                    if (key in line) {
                        line[key] = value;
                    }
                });
            });
        }


        if (Array.isArray(updates.chargeComponents)) {
            parsedJson.lines.forEach((line) => {
                const targetComponents = line?.charges?.[0]?.chargeComponents;
                if (!Array.isArray(targetComponents)) return;

                updates.chargeComponents.forEach((updateComp, compIndex) => {
                    const targetComp = targetComponents[compIndex];
                    if (!targetComp) return;

                    Object.entries(updateComp).forEach(([key, value]) => {
                        targetComp[key] = value;
                    });
                });
            });

        }

        // --------------------------------------
        // 4. Save file
        // --------------------------------------
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, "utf-8");

        return updatedJson;

    }


    public static async updateAllUpdatedFieldsInJSONPayload(filePath: string, updates: Record<string, any>, parentArray?: string,) {
        const rawJson = await fs.promises.readFile(filePath, "utf-8");
        const parsedJson = JSON.parse(rawJson);

           for (const key of Object.keys(updates)) {
            if (key !== "lines" && key !== "chargeComponents" && key in parsedJson) {
                parsedJson[key] = updates[key];
            }
        }

        parsedJson.lines.forEach((line, index) => {
            const updateLine = updates.lines[index];
            if (!updateLine) return;

            // Update simple fields
            Object.entries(updateLine).forEach(([key, value]) => {
                if (key !== "chargeComponents" && key in line) {
               //     console.log(`the value of the lines is ${line[key]}`)
                    line[key] = value;
                }
            });

            // Update chargeComponents for this line
            if (Array.isArray(updateLine.chargeComponents)) {
                const targetComponents = line?.charges?.[0]?.chargeComponents;
                if (!Array.isArray(targetComponents)) return;

                updateLine.chargeComponents.forEach((compUpdate, compIndex) => {
                    const targetComp = targetComponents[compIndex];
                    if (!targetComp) return;

                    Object.entries(compUpdate).forEach(([key, value]) => {
                        targetComp[key] = value;
                    });
                });
            }
        });
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        await fs.promises.writeFile(filePath, updatedJson, "utf-8");

        return updatedJson;

    }

}

