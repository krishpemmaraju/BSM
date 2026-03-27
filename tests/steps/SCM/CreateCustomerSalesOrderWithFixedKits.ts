import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../../../src/support/CustomWorld";
import Assert from "../../../src/asserts/Assert";
import { sharedData } from "../../../src/support/SharedData";
import * as fs from 'fs';

setDefaultTimeout(300000);
let IsOrderStatusCorrect: boolean;
let orderStatus: string;
Then('Capture the Kits products and quantities and should see order status as {string}', async function (this: ICustomWorld, lineStatus) {
    await this.manageOrderSCMRedwood.IsSearchResultDisplayed(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER)
    await this.manageOrderSCMRedwood.ClickOnOrderLink(this.newWindow, sharedData.CUSTOMERSALESORDERNUMBER);
    for (let i = 0; i < 40; i++) {
        orderStatus = await this.manageOrderSCMRedwood.GetOrderStatusFromManageOrders(this.newWindow, 'Status', sharedData.CUSTOMERSALESORDERNUMBER.trim()) ?? '';
        if (orderStatus === lineStatus) {
            IsOrderStatusCorrect = true;
            break;
        }
        else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.createOrderPage.ClickOnRefreshSCMOMNewWindow(this.newWindow);
        }
    }
    await Assert.AssertTrue(lineStatus === orderStatus)
    let product = await this.manageOrderSCMRedwood.GetProductQuantityKitsInfoFromOrder(this.newWindow, 'Item', sharedData.variableKitsOptionalProduct) as string[];
    sharedData.KitsChildProducts = product;
    const writeJson: Record<string, string | number> = {}
    writeJson["CustomerSalesOrderKits"] = sharedData.CUSTOMERSALESORDERNUMBER;
    if ((this.featureName ?? '').trim().includes('CreateCustomerSalesOrderWithVariableKits')) {
        writeJson["Total_Variable_Kits_Products"] = product.length;
        writeJson["Variable_Parent_Kits_Product"] = sharedData.variableKitsParentProduct;
        writeJson["Variable_Optional_Kits_Product"] = sharedData.variableKitsOptionalProduct;
        product.forEach((item, index) => {
            writeJson[`Product_Variable_${sharedData.variableKitsParentProduct}_${index + 1}`] = item
        })
        writeJson["Quantity"] = sharedData.quantity;
    } else {
        writeJson["Total_Fixed_Kits_Products"] = product.length;
        writeJson["Parent_Fixed_Kits_Product"] = sharedData.KitsParentProduct;
        product.forEach((item, index) => {
            writeJson[`Product_Fixed_${sharedData.KitsParentProduct}_${index + 1}`] = item
        })
        writeJson["Quantity"] = sharedData.quantity;
    }
    fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json', JSON.stringify(
        writeJson, null, 2));
    await this.newWindow.close();
    await this.originalPage.bringToFront();
    await this.orderManagementPage.ClickOnClose();

});

Then('User should see the status for Kits CustomerSalesOrder as {string}', async function (this: ICustomWorld, lineStatus) {
    await Assert.AssertTrue(await this.shipmentLinePage.GetShipmentLineStatusForKits(sharedData.KitsChildProducts, 'Line Status', lineStatus));

});


Then('User should Capture ShipmentID for CustomerSalesOrder created for kits', async function (this: ICustomWorld) {

    let getShipmentIDForProduct: string[] = [];
    getShipmentIDForProduct = await this.shipmentLinePage.GetShipmentIDForKits(sharedData.KitsChildProducts, 'Shipment');

    if (getShipmentIDForProduct.every(k => k === getShipmentIDForProduct[0])) {
        sharedData.shipmentNumberKits = getShipmentIDForProduct[0]
        let data: any = {};
        if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json')) {
            const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json', 'utf8');
            if (content.trim()) {
                data = JSON.parse(content);
            }
        }
        data.ShipmentNumberkits = sharedData.shipmentNumberKits.trim();
        fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json', JSON.stringify(
            data, null, 2));
    } else {
        let data: any = {};
        if (fs.existsSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json')) {
            const content = fs.readFileSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json', 'utf8');
            if (content.trim()) {
                data = JSON.parse(content);
            }
        }
        getShipmentIDForProduct.forEach((item, index) => {
            data[`ShipmentID_${sharedData.KitsParentProduct}_${index + 1}`] = item
        })
        fs.writeFileSync('src/data/TransferOrderData/CustomerSalesOrderKitsData.json', JSON.stringify(
            data, null, 2));
    }
});

Then('User should see the tiles contaning product and {string} information', async function
    (this: ICustomWorld, branch) {
    // sharedData.quantity = '2';
    for (const prod of sharedData.KitsChildProducts) {
        await Assert.AssertTrue(await this.confirmPicksPage.IsProuctTileDisplayed(prod));
        await Assert.assertContains((await this.confirmPicksPage.GetPickingQuantityFromMultiProductTile(prod)).split('-')[0].split(' ')[0].trim(), sharedData.quantity.trim())
        await Assert.assertContains((await this.confirmPicksPage.GetPickingSourceBranchFromProductTilePane(prod)).split(':')[1].trim(), this.testdata![0].SUBINVENTORY.split('-')[1].trim())
    }
});


When('User enter subinventory info as {string} products , picked quantity for all products in Customer Sales Order', async function (this: ICustomWorld, branch) {
    await this.confirmPicksPage.EnterSubInventoryPickedQtyMultiLine(sharedData.quantity);
});

// For Shipping Information 

When('User enters Shipment Number for Kits Customer Sales Order', async function (this: ICustomWorld) {
    await this.confirmShipmentPage.EnterShipmentNumber(sharedData.shipmentNumberKits.trim());
});

Then('User should see Shipment page to ship goods for multi line products', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.confirmShipmentPage.IsShipmentNumberPageForMultiLineDisplayed(sharedData.shipmentNumberKits));
});

When('User clicks on Shipment Number tile for Multiline products and validate Shipped quantity under Shipment Line Data', async function (this: ICustomWorld) {
    await Assert.AssertTrue(await this.confirmShipmentPage.ConfirmShipmentMultiLines(sharedData.quantity));
});

//After Confirm Ship for Kits Order 

Then('User should validate shipped quantity for Kits Customer Sales Order', async function (this: ICustomWorld) {
    Assert.AssertTrue(await this.shipmentLinePage.IsShippedQuantityUpdatedAfterShipping(sharedData.KitsChildProducts, sharedData.quantity, 'Ship Quantity'));
});
