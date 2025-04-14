import { expect } from "@playwright/test";


export default class Assert {

    /**
     * To verify the condition passed as input is true
     * @params condition - boolean condition
     * @params softAssert - for soft asserts this can be set as true otherwise false
     */

    public static async AssertTrue(condition: boolean,softAssert = false){
        try{
            expect(condition,`Expected is 'True' But Actual is '${condition}'`).toBeTruthy();
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

    /**
     * To verify value2 contains expected value2
     * @params value1 - Expected Value
     * @params value2 - Actual Value
     * @params softAssert - for soft asserts this can be set as true otherwise false
     */

    public static async assertContains(value1: string,value2: string,softAssert = false){
        try{
            expect(value1,`'${value1}' is expected to contains '${value2}'`).toContain(value2);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

     /**
    * To verify that value2 contains expected value1 ignoring case
    * @param value1 - string input
    * @param value2 - should be present in value1
    * @param description - description of element that is being validated
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */

     public static async assertContainsIgnoreCase(value1: string,value2: string,softAssert = false){
        try{
            expect(value1.toLowerCase(),`'${value1.toLowerCase()}' is expected to contains '${value2.toLowerCase()}'`).toContain(value2.toLowerCase());
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

     /**
    * To verify that value1 equals value2 
    * @param expValue - string input [ expected ]
    * @param actvalue - should be present in value1 [ actual ]
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */

     public static async assertEquals(expValue: string,actValue: string,softAssert=false){
        try{
            expect(expValue,`'${actValue} should be equal to '${expValue}'`).toEqual(actValue);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
     }

      /**
    * To verify that value1 equals value2 
    * @param expValue - int input [ expected ]
    * @param actvalue - should be present in value1 [ actual ]
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */

      public static async assertEqualsInt(expValue: number,actValue: number,softAssert=false){
        try{
            expect(expValue,`'${actValue} should be equal to '${expValue}'`).toEqual(actValue);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
     }

      /**
    * To verify that value1 equals value2 with ignorecase
    * @param expValue - string input ignorecase[ expected ]
    * @param actvalue - should be present in value1 ignorecase [ actual ]
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */
      public static async assertEqualsIgnorecase(expValue: string,actValue: string,softAssert=false){
        try{
            expect(actValue.toLowerCase(),`'${actValue.toLowerCase()} should be equal to '${expValue.toLowerCase()}'`).toEqual(expValue.toLowerCase());
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
     }

         /**
    * To condition is false
    * @param condition - boolean value
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */

    public static async assertFalsy(condition: boolean,softAssert=false){
        try{
            expect(condition,`Expected is False but Actual is '${condition}'`).toBeFalsy();
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

       /**
    * To verify that actual value does not contain in Expected value
    * @param expValue - string input [ expected ]
    * @param actvalue - string to verify the condition [ actual ]
    * @param softAssert - for soft asserts this has to be set to true, else this can be ignored
    */

    public static async assertNotContains(expValue: string,actValue: string,softAssert=false){
        try{
            expect(actValue,`'${actValue} not contain '${expValue}`).not.toContain(expValue);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

      /**
     * To validate that value is null
     * @param value any value
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */

    public static async assertNull(actValue: string,softAssert=false){
        try{
            expect(actValue,`Expected is null but Actual value is '${actValue}'`).toEqual(null);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

     /**
     * To validate that value is not null
     * @param value any value
     * @param softAssert for soft asserts this has to be set to true, else this can be ignored
     */

     public static async assertNotNull(actValue: string,softAssert=false){
        try{
            expect(actValue,`Expected is not null but Actual value is '${actValue}'`).not.toEqual(null);
        }catch(error){
            if(!softAssert) throw new Error(error);
        }
    }

}