Feature: Validate Invoice flow for Cash Account Customer Sales Order

    # This features validates below
    #     Create a Single Line Sales Order
    #     Perform Picking and Shipping
    #     Validate the status of the Order
    #     Run the JOb BSAM SALES ORDER INVOICE
    #     Validate the status of the order in SCM
    #     Validate the order in ODS table

    @api
    Scenario Outline: Create Customer Sales Order for "<product>" for branch "<DestinationOrg>"
        Given the API end point for Customer Order API
        When user update the payload with "<product>","<DestinationOrg>","<quantity>","<productPrice>"
        And User execute post request for Customer Sales Order API
        Then user should receive 201 response code
        And capture the customer sales order single line response data
        Examples:
            | product | DestinationOrg | quantity | productPrice |
            | 123305  | 1BL            | 2        | 53.09        |

    @SCM
    Scenario:  Validate Order Created in SCM
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management (New)" Sub section
        And User clicks on "Manage Orders" under Actions menu
        Then User should see Manage Orders Page
        When User enters the customer sales order number
        And User clicks on search
        Then User should see the order status as "Awaiting Shipping"

    @SCM
    Scenario Outline: Validate Customer Sales Order Status  in SaaS after Received
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Inventory Management
        And  Select the "<SubInventory>" on InventoryManagement Screen
        And User Select "Shipment Lines" from Quick Access
        And User enter the CustomerSalesOrder Number
        And User tabs out
        And User enter  CustomerSalesOrder Number under ShipmentLines
        Then User Should see Shipment Lines Page with Line Status as Ready to release
        When User clicks on Pick Release from More Actions
        Then User should see the status for CustomerSalesOrder as "Released to warehouse" for "<product>"
        And User should Capture ShipmentID for CustomerSalesOrder

        Examples:
            | SubInventory  | product |
            | Peckham - 1BL | 123305  |

    @SCM
    Scenario Outline: Perform Confirm Pick for the Customer Sales Order created
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Inventory Execution
        And User Clicks on "Confirm Pick"
        Then User Should see Confirm Picks page
        When User selects the Organization as "<branch>"
        When User clicks on Continue
        Then User Should see Confirm Picks page
        When User selects "Order Number" from Advanced search
        And User enters CustomerSalesOrder Number
        And User tabs out
        Then User should see the tile contaning "<product>" and "<branch>" information
        When User selects the tile for the "<product>" pick confirm
        And user enter subinventory info as "<branch>" for Customer Sales Order
        And User enter product number as "<product>"
        And User enters Picked quantity for Customer Sales Order
        And Click on Confirm Pick and Close

        Examples:
            | branch        | product |
            | Peckham - 1BL | 123305  |

    @SCM
    Scenario Outline: Perform Ship Goods for the Customer Sales Order created
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Inventory Execution
        And User Clicks on "Ship Goods"
        Then User Should see Ship Goods page
        When User selects the Organization as "<branch>"
        And User clicks on Continue
        Then User Should see Ship Goods page
        When User enters Shipment Number for Customer Sales Order
        And User clicks on Continue
        Then User should see Shipment page to ship goods for product "<product>"
        When User clicks on Shipment Number tile for product "<product>"
        Then Validate Shipped quantity under Shipment Line Data
        And Click on Confirm Shipment for Customer SO

        Examples:
            | branch        | product |
            | Peckham - 1BL | 123305  |

    @SCM
    Scenario Outline: Validate Customer Sales Order Status  in SaaS after Shipped
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Inventory Management
        And  Select the "<SubInventory>" on InventoryManagement Screen
        And User Select "Shipment Lines" from Quick Access
        And User enter the CustomerSalesOrder Number
        And User tabs out
        And User enter  CustomerSalesOrder Number under ShipmentLines
        Then User Should see Shipment Lines Page with Line Status as Interfaced
        And User should validate shipped quantity for Customer Sales Order

        Examples:
            | SubInventory  | product |
            | Peckham - 1BL | 123305  |

    @SCM
    Scenario:  Validate Order Created in SCM after shipped and status is 'Awaiting Invoice'
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management (New)" Sub section
        And User clicks on "Manage Orders" under Actions menu
        Then User should see Manage Orders Page
        When User enters the customer sales order number
        And User clicks on search
        Then User should see the order status as "Awaiting Invoice"


    @SCM
    Scenario Outline: Run BSM Invoice Job to send invoice details to ODS
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Tools
        And User Clicks on Scheduled Processes
        Then User should see Scheduled processes page
        When User Clicks on Schedule New Processes
        Then User should see Shcedule New Process page
        When User search for the job "<jobName>"
        Then User should see Process details
        When User fill the details "<subinventory>"
        And User clicks on submit
        Then Capture the processID
        When User search for the process
        Then User should see the status as succeeded

        Examples:
            | jobName                               | subinventory |
            | BSM Sales Order Extract for Invoicing | 1BL          |

    @MFT
    Scenario Outline: Validate Invoice File Upload in MFT
        Given User login into MFT application
        When User click on Navigate
        And User enter "<devfolderpath>"
        Then User should see the file "<fileName>" under the path

        Examples:
            | devfolderpath                                       | fileName                 |
            | /opc/dev/inbound/SCM_Order_Lines_To_Invoice_For_ODS | SCMOrderLinesToInvoicing |

    @DB
    Scenario:
        Given user login into ODS
        When User run the query to validate invoice transactions
        Then User should see the results with the order results


    @SCM
    Scenario:  Validate Order Created in SCM after shipped and status is 'ODSAcknowledged'
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management (New)" Sub section
        And User clicks on "Manage Orders" under Actions menu
        Then User should see Manage Orders Page
        When User enters the customer sales order number
        And User clicks on search
        Then User should see the order status as "ODSAcknowledged"
