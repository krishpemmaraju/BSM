import randomString from "randomstring";
import format from "string-format";

export default class StringUtils {

    /**
  * Generates random alphanumeric string of given length
  * @param length 
  * @returns 
  */
    public static randomAlphanumericString(length: number): string {
        const str = randomString.generate(length);
        return str;
    }

    /**
    * Generates random alphabetic string of given length
    * @param length 
    * @returns 
    */
    public static randomAlphabeticString(length: number): string {
        const str = randomString.generate({ length: length, charset: 'alphabetic' });
        return str;
    }

    /**
   * Generates random string of given length with all letters a as uppercase
   * @param length
   * @returns
   */

    public static randomUpperCaseString(length: number): string {
        const str = randomString.generate({ length: length, charset: 'alphabetic', capitalization: 'uppercase' });
        return str;
    }
    /**
     * Generates random string of given length with all letters a as lowercase
     * @param length
     * @returns
     */

    public static randomLowerCaseString(length: number): string {
        const str = randomString.generate({ length: length, charset: 'alphabetic', capitalization: 'lowercase' });
        return str;
    }

    /**
     * Generates random number string of given length
     * @param length
     * @returns
     */

    public static randomNumberString(length: number): string {
        const str = randomString.generate({ length: length, charset: 'numeric' });
        return str;
    }

    /**
      * This method will return the formatted String by replacing value in {key} from Object
      * @param str 
      * @param obj 
      * @returns 
      */

    public static formatStringFromObject(str: string, obj: any): string {
        return format(str, obj);
    }

     /**
   * This method will return the formatted String by replacing value in {key}
   * @param str : String to be formatted
   * @param replaceValue : value to replaced in formatted string
   * @returns str
   */

   public static formatStringValue(str:string,replaceValue: any):string {
       for(const [key,value] of Object.entries(replaceValue)){
         str = str.split(`{${key}}`).join(`${value}`);
       }
       return str;
   }

}