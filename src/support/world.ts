import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import axios from "axios";
import SCMLoginPage from "../webui/pages/scm/SCMLoginPage";
import SCMHomePage from "../webui/pages/scm/SCMHomePage";
import UIActions from "../webui/actions/UIActions";
import { Page } from "@playwright/test";
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


export default class CustomWorld extends World {
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
    web: UIActions;
    page: Page;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async init() {
        this.web = new UIActions(this.page);
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
    }
}

setWorldConstructor(CustomWorld)