import { ITestCaseHookParameter, IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import axios, { AxiosResponse } from "axios";
import SCMLoginPage from "../webui/pages/scm/SCMLoginPage";
import SCMHomePage from "../webui/pages/scm/SCMHomePage";
import UIActions from "../webui/actions/UIActions";
import { Browser, BrowserContext, Page } from "@playwright/test";
import InventoryManagementPage from "../webui/pages/scm/InventoryManagementPage";
import CreateMiscellaneousTransactions from "../webui/pages/scm/CreateMiscellaneousTransactionsPage";
import VBCSOrderCaptureUIPage from "../webui/pages/vbcsoc/VBSOrderCaptureUI";
import StockAvailabilityCheckPage from "../webui/pages/scm/StockAvailabilityCheckPage";
import OrderCaptureUIPage from "../webui/pages/vbcsoc/OrderCaptureUIPage";
import VBSOCHomePage from "../webui/pages/vbcsoc/VBSOCHomePage";
import OrderManagementPage from "../webui/pages/scm/OrderManagementPage";
import CreateOrderPage from "../webui/pages/scm/CreateOrderPage";
import SupplyOrchestrationPage from "../webui/pages/scm/SupplyOrchestrationPage";
import ManageSupplyPage from "../webui/pages/scm/ManageSupplyPage";
import InventoryManagementActionsPage from "../webui/pages/scm/InventoryManagementActionsPage";
import SCMTransferOrdersPage from "../webui/pages/scm/SCMTransferOrdersPage";
import InventoryExecutionPage from "../webui/pages/scm/InventoryExecutionPage";
import ReceiveGoodsPage from "../webui/pages/scm/ReceiveGoodsPage";
import PutAwayGoodsPage from "../webui/pages/scm/PutAwayGoodsPage";
import ShipmentLinesPage from "../webui/pages/scm/ShipmentLinesPage";
import ConfirmPicksPage from "../webui/pages/scm/ConfirmPicksPage";
import { WorldImplPages } from "./worldImpl";
import WebBrowserManager from "../manager/browserManager";
import RestRequest from "../api/actions/RESTRequest";
import ConfirmShipmentPage from "../webui/pages/scm/ConfirmShipmentPage";
import SCMWolOrderCaptureHomePage from "../webui/pages/scm/SCMOrderCaptureHomePage";
import ManageOrdersRedwood from "../webui/pages/scm/ManageOrdersRedwood";
import ScheduledProcessesPage from "../webui/pages/scm/ScheduledProcessessPage";
import MFTActionsPage from "../webui/pages/scm/MFTActionsPage";



export default class CustomWorld extends World implements WorldImplPages {
    /* Environment */
    envData: string = '';
    /* Declaring the variables */
    SCMURL: string = '';
    SCMUSER: string = '';
    SCMPASSWORD: string = '';
    MFTURL: string = '';
    MFTUSER: string = '';
    MFTPASSWORD: string = '';
    SCMSTOCKCHKAPI: string = '';
    SCMCHKAVAILABILITY: string = '';
    VBCSURL: string = '';
    VBCSUSER: string = '';
    VBCSPASSWORD: string = '';
    ONPREMOSBURL: string = '';
    ONPREMSOAURL: string = '';
    ONPREMUSER: string = '';
    ONPREMPASSWORD: string = '';
    CUSTOMERSALESORDER: string = ''
    customerSalesEndPointAPI: string = ''
    getResponse!: AxiosResponse;
    originalPage!: Page;
    newWindow!: Page;
    /* Page Objects Declaration */
    scmLoginPage !: SCMLoginPage;
    scmHomePage !: SCMHomePage;
    inventoryManagamentPage !: InventoryManagementPage;
    createMiscelleneousTransactionPage !: CreateMiscellaneousTransactions;
    vbcsOrderCaptureUIPage !: VBCSOrderCaptureUIPage;
    stockAvailabilityPage !: StockAvailabilityCheckPage;
    orderCaptureUIPage !: OrderCaptureUIPage;
    vbsocHomePage !: VBSOCHomePage;
    orderManagementPage !: OrderManagementPage;
    createOrderPage !: CreateOrderPage;
    supplyOrchestrationPage!: SupplyOrchestrationPage;
    manageSupplyPage!: ManageSupplyPage;
    inventoryManagementActionsPage!: InventoryManagementActionsPage;
    scmTransferOrdersPage!: SCMTransferOrdersPage;
    invExecutionPage!: InventoryExecutionPage;
    receiveGoodsPage!: ReceiveGoodsPage;
    putAwayGoodsPage!: PutAwayGoodsPage;
    shipmentLinePage!: ShipmentLinesPage;
    confirmPicksPage!: ConfirmPicksPage;
    confirmShipmentPage!: ConfirmShipmentPage;
    scmWolOrderCaptureHomePage!: SCMWolOrderCaptureHomePage;
    manageOrderSCMRedwood!: ManageOrdersRedwood;
    scheduledProcesses!: ScheduledProcessesPage;
    mftActionsPage!: MFTActionsPage;
    web!: UIActions;
    page!: Page;
    rest!: RestRequest;
    browser!: Browser;
    context!: BrowserContext;
    hook!: ITestCaseHookParameter;


    constructor(options: IWorldOptions) {
        super(options);
    }



    async init(app: string) {
        //Initialize the Browsers 
        if (!['api', 'db'].includes(app.toLowerCase())) {
            this.browser = await WebBrowserManager.launch(app === 'vbsoc' ? 'firefox' : 'chromium');
            await new Promise(r => setTimeout(r, 300));
            this.context = await this.browser.newContext({
                viewport: null,
                // screen: { width: 1920, height: 1080 },
                ignoreHTTPSErrors: true,
                acceptDownloads: true
            });
            await this.context.clearCookies();
            this.page = await this.context.newPage();
            // Force maximize for Firefox (and others)
            // await this.page.evaluate(() => {
            //     window.moveTo(0, 0);
            //     window.resizeTo(screen.availWidth, screen.availHeight);
            // });


            // Initialize Page Objects
            this.web = new UIActions(this.page);
            this.rest = new RestRequest(this.page);
            this.scmLoginPage = new SCMLoginPage(this.web);
            this.scmHomePage = new SCMHomePage(this.web);
            this.inventoryManagamentPage = new InventoryManagementPage(this.web);
            this.createMiscelleneousTransactionPage = new CreateMiscellaneousTransactions(this.web);
            this.vbcsOrderCaptureUIPage = new VBCSOrderCaptureUIPage(this.web);
            this.stockAvailabilityPage = new StockAvailabilityCheckPage(this.web);
            this.orderCaptureUIPage = new OrderCaptureUIPage(this.web);
            this.vbsocHomePage = new VBSOCHomePage(this.web);
            this.orderManagementPage = new OrderManagementPage(this.web);
            this.createOrderPage = new CreateOrderPage(this.web);
            this.supplyOrchestrationPage = new SupplyOrchestrationPage(this.web);
            this.manageSupplyPage = new ManageSupplyPage(this.web);
            this.inventoryManagementActionsPage = new InventoryManagementActionsPage(this.web);
            this.scmTransferOrdersPage = new SCMTransferOrdersPage(this.web);
            this.invExecutionPage = new InventoryExecutionPage(this.web);
            this.receiveGoodsPage = new ReceiveGoodsPage(this.web);
            this.putAwayGoodsPage = new PutAwayGoodsPage(this.web);
            this.shipmentLinePage = new ShipmentLinesPage(this.web);
            this.confirmPicksPage = new ConfirmPicksPage(this.web);
            this.confirmShipmentPage = new ConfirmShipmentPage(this.web);
            this.scmWolOrderCaptureHomePage = new SCMWolOrderCaptureHomePage(this.web);
            this.manageOrderSCMRedwood = new ManageOrdersRedwood(this.web);
            this.scheduledProcesses = new ScheduledProcessesPage(this.web);
            this.mftActionsPage = new MFTActionsPage(this.web);
        }
    }

}
export type ICustomWorld = CustomWorld;