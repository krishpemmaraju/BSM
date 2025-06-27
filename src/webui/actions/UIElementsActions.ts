import { Locator, Page } from "@playwright/test";


export default class UIElementActions {

   protected locator: Locator;
   protected description: string;
   protected selector: string;

   constructor(private page: Page){}

   /**
    * Returns first locator
    * @returns
    */

   public getLocator(): Locator{
    return this.locator.first();
   }

    /**
    * Returns all locators
    * @returns
    */

    public getLocators(): Locator{
        return this.locator;
    }

    /**
     * Sets the locator using the selector
     * @param selector
     * @param description
     * @returns
     */

    public setElement(selector: string,description: string): UIElementActions {
        this.selector = selector;
        this.description = description;
        this.locator = this.page.locator(selector);
        return this;
    }

    public setElementByPageRolesHasText(roleVal: Parameters<Page['getByRole']>[0],isHasText: string){
           return this.page.getByRole(roleVal,{exact:true}).filter({hasText: isHasText});
    }

    public setElementByPageRoles(roleVal: Parameters<Page['getByRole']>[0]){
      return this.page.getByRole(roleVal,{exact:true});
}

    public setElementByPageRolesExactText(roleVal: Parameters<Page['getByRole']>[0],isHasText: string){
      return this.page.getByRole(roleVal,{exact:true}).filter({hasText: isHasText});
}

    public setElementByPageRolesHasName(roleVal: Parameters<Page['getByRole']>[0],nameVal: string){
      return this.page.getByRole(roleVal,{name: nameVal,exact:true}); }

      public setElementByPageByTexts(role: string, valData: string){
         if( role === "label")
          return this.page.getByLabel(valData,{exact: true});
        if( role === "text")
          return this.page.getByText(valData,{exact: true});
        if(role === "placeholder")
          return this.page.getByPlaceholder(valData,{exact: true});
        if(role === "title")
          return this.page.getByTitle(valData,{exact: true});
      }

     /**
     * Sets the locator using the description
     * @param selector
     * @param description
     * @returns
     */

     public setLocator(locator: Locator,description: string): UIElementActions{
        this.locator = locator;
        this.description = description;
        return this;
     }

       /**
   * Click on element
   * @returns
   */

    public async click(){
        await this.getLocator().click();
        return this;
    }


    
       /**
   * Set Text to a element
   * 
   * @returns
   */

       public async setText(valueToSet: string){
        await this.getLocator().fill(valueToSet)
        return this;
    }

      
       /**
   * Set Type to a element
   * 
   * @returns
   */

       public async setType(valueToSet: string){
        await this.getLocator().type(valueToSet)
        return this;
    }

     /**
   * Double click on element
   * @returns
   */

    public async doubleClick(){
        await this.getLocator().dblclick();
        return this;
    }

     /**
   * scroll element into view, unless it is completely visible
   * @returns
   */

    public async scrollIntoViewElement(){
        await this.getLocator().scrollIntoViewIfNeeded();
        return this;
    }

      /**
   * Wait for element to be invisible with out time out
   * @returns
   */
   
   public async waitForElementToVisibleWithOutTimeOut() {
      await this.getLocator().waitFor({state: 'visible'});
      return this;
   }

      /**
   * Wait for element to be invisible with  time out in seconds
   * @params timeout
   * @returns
   */

    public async waitForElementToVisibleWithTimeOut(seconds: number) {
        await this.getLocator().waitFor({state: 'visible', timeout:seconds*1000});
        return this;
     }

      /**
   * wait for element not to be present in DOM
   * @params timeout in seconds
   * @returns
   */
  
    public async waitforElementTillDetached(seconds: number){
        await this.getLocator().waitFor({state:'detached',timeout:seconds*1000});
        return this;
    }

       /**
   * wait for element not to be present in DOM
   * @params timeout in seconds
   * @returns
   */

   public async waitForElementToVisible(seconds: number){
        await this.getLocator().waitFor({state:'visible',timeout: seconds*1000});
        return this;
   }

       /**
   * wait for element attached in DOM with timeout in seconds
   * @params seconds
   * @returns
   */

   public async waitForElementToAttachedInDOM(seconds: number){
       await this.getLocator().waitFor({state:'attached',timeout: seconds*1000});
       return this;
     }


     /**
   * This method hovers over the element
   */

     public async hoverOnElement(){
        await this.waitForElementToVisible(2); 
        await this.getLocator().hover();
     }
    
     /**
   * Returns input.value for <input> or <textarea> or <select> element.
   * @returns
   */

     public async getInputValue(): Promise<string> {
        await this.waitForElementToVisible(2);
        return await this.getLocator().inputValue();
     }

     /**
   * Gets the text content
   * @returns
   */
  
    public async getTextValue(): Promise<string>{
        await this.waitForElementToVisible(2);
        return (await this.getLocator().textContent()).trim();
    }

     /**
   * Get Attribute value
   * @param attributeText
   * @returns
   */

    public async getAttributeValue(attributeText: string): Promise<string>{
    //    await this.waitForElementToVisible(2);
        return (await this.getLocator().getAttribute(attributeText)).trim();
    }

     /**
   * Get innerHTML
   * @returns
   */

    public async getInnerHtml(): Promise<string>{
        await this.waitForElementToVisible(2);
        return (await this.getLocator().innerHTML()).trim();
    }

    /**
     * get inner text
     * @returns
     */

    public async getInnerText(): Promise<string>{
        await this.waitForElementToVisible(2);
        return (await this.getLocator().innerText()).trim();
    }

 

     /**
   * checks if element is enabled
   * @param sec
   * @returns Promise<boolean>
   */ 

    public async isElementEnabled(): Promise<boolean> {
        await this.waitForElementToVisible(2);
        return await this.getLocator().isEnabled();
    }

     /**
   * checks if element is editable
   * @param sec
   * @returns Promise<boolean>
   */ 

     public async isElementEditable(): Promise<boolean> {
      await this.waitForElementToVisible(2);
      return await this.getLocator().isEditable();
  }

     /**
   * checks if element is visible
   * @param sec time for element to be visible
   * @returns Promise<boolean>
   */

     public async isElementVisible(seconds: number): Promise<boolean>{
        let isVisible: boolean
        try{
            isVisible = await this.getLocator().isVisible({timeout: seconds*1000})
        }catch(error){
            isVisible = false;
        }
        return isVisible;
     }

       /**
   * Press a key on web element
   * @param key
   */

   public async keyPress(key: string){
      await this.getLocator().press(key);
      return this;
   }

     /**
   * Get all the text Content
   * @returns
   */

   public async getAllTextContents(): Promise<string[]> {
      await this.waitForElementToVisible(2);
      return await this.getLocators().allTextContents();
   }

    /**
   * Get the count of
   * @returns
   */

   public async getLocatorCount(): Promise<number>{
      await this.waitForElementToVisible(2);
      return await this.getLocators().count();
   }

   /**
   * Click on element using js
   * @returns
   */

   public async clickOnJS(){
      await this.waitForElementToVisible(2);
      await this.getLocator().evaluate((node: HTMLElement) => {node.click();})
   }

   
     /**
   * Gets the text value by Role
   * @returns
   */
  
     public async getTextValueByRole(roleVal: Parameters<Page['getByRole']>[0]): Promise<string>{
         return await this.page.getByRole(roleVal).textContent();
  }






}