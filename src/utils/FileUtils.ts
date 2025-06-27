import { error } from 'console';
import * as fs from 'fs';

export default class FileUtils {

    public getDataFromFileToList(filePath: string,ignoreLines: number) {
        try {
            const lines: string[] = [];
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return fileContent.split('\n').map(line => line.split(',')[0].trim()).slice(ignoreLines);
        }
        catch (err) {
            console.error('Error reading the file:', error);
            return [];
        }
    }
}