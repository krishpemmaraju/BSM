

export default class HeaderBuilder {

    public static  async BuildAuthTokenHeader(token: string): Promise<Record<string,string>>{
        return {
                'Content-Type' : 'application/json',
            ... (token && { Authorization : `Bearer ${token}`})
        }
  
    }

    public static async BuildBasicAuthHeader(username: string, password: string) : Promise<Record<string, string>>{
        const token = Buffer.from(`${username}:${password}`).toString('base64');    
            return {
                'Content-Type': 'application/json',
                'Authorization':  `Basic ${token}`
            }
    }

   public static async BuildMultipleHeaders(customHeaders: Record<string,string>): Promise<Record<string,string>>{
         return { ... customHeaders }
   } 
}