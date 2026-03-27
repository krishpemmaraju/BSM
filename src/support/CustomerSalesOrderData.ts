

export interface CustomerSalesOrderData {
    CustomerSalesOrderSingleLine?: {
        BRANCH: string,
        FEEDER: string,
        PRODUCT: string,
        PRODUCT1: string,
        PRODUCT2: string,
        PARENTPRODUCT: string,
        VARIABLEPRODUCT: string,
        CHILDPRODUCT: string,
        QUANTITY: string,
        QUANTITYISSUE: string,
        PRODUCTPRICE: string,
        PRODUCTPRICE1: string,
        PRODUCTPRICE2: string,
        SUBINVENTORY: string,
        SUBINVENTORYBRANCH: string,
        BSMINVOICEJOBNAME: string,
        BSMCSVFILENAME: string,
        DESTINATIONFEEDER: string,
        SUBINVENTORYSTKADJ: string,
        SUBINVENTORYSTKADJLOC: string,
        LOCATOR: string,
        REASONCODE: string,
        TRANSACTIONRECEIPT: string,
        TRANSACTIONISSUE: string
    }[];

}