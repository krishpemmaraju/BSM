Feature: Validate Transfer Order Creation receiving process

    # This feature validate the creating transfer order and performing the picking , receiving and shipping process
    # with in SCM. This feature will not be able to check the Supply Planning as it will take one hour to run the collection
    # get the order to be available in the planning

    # @api
    # Scenario Outline: Create Transfer Order for "<product>" and receive at branch "<DestinationOrg>"
    #     Given the API end point for Create Transfer Order API
    #     When user update the payload with "<product>","<DestinationOrg>","<DestinationSubOrg>","<SourceOrg>","<quantity>"
    #     And User send the post request to the endpoint
    #     Then User should have 201 response code successful and capture interface number

    #     Examples:
    #         | product | DestinationOrg | DestinationSubOrg | SourceOrg | quantity |
    #         | 100880  | 1BL            | 1BL               | F6        | 2        |

    # @SCM
    # Scenario Outline: Validate Transfer Order created in SaaS
    #     Given User login into SCM application
    #     When User navigate to Supply Chain Execution
    #     And User click on Supply Orchestration
    #     Then User should see Supply Orchestration Page
    #     When navigate to Manage Supply Lines
    #     Then User should see Manage Supply Lines Page
    #     When User enter the Supply Reference number
    #     And Click on Search
    #     Then User should see Transfer Order Created and Capture the Transfer Order number
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User click on "View all actions"
    #     Then User should see Actions pop up
    #     When User click on "Transfer Orders" under "Inventory Transactions"
    #     Then User should see "Transfer Orders" Page
    #     When Select the "Today" from filter
    #     And  User enter the Transfer Order Number
    #     Then Capture the "Item", "Requested Quantity", "Interface Status"

    #     Examples:
    #         | SubInventory                       |
    #         | WOLSELEY CENTERS DISTRIBUTION - F6 |

    # @DB
    # Scenario Outline: Validate TO created in Highjump
    #     Given User Connected to HJ DB
    #     When User runs the select query
    #     Then User should see the results

    @api
    Scenario Outline: Run IF206 API to Ship Confirm
        Given the API end point IF206 Ship Confirm
        When user update the payload with values captured from HJ DB
        And User send the post request
        Then User should have 200 response code successful

    # @SCM
    # Scenario Outline: Validate Transfer Order Status created in SaaS after Ship Confirm
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User click on "View all actions"
    #     Then User should see Actions pop up
    #     When User click on "Transfer Orders" under "Inventory Transactions"
    #     Then User should see "Transfer Orders" Page
    #     When Select the "Today" from filter
    #     And  User enter the Transfer Order Number
    #     Then Validate fulfillment status updated as "Shipped"
    #     When User clicks on TO from search results
    #     Then User should see the TO Page
    #     When User clicks on the product Link on TO search results Page
    #     Then User should see the Shipment and Receipt page and capture the Shipment ID


    #     Examples:
    #         | SubInventory                       |
    #         | WOLSELEY CENTERS DISTRIBUTION - F6 |

    # @SCM
    # Scenario Outline: Perform Receive Goods for the TO created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Receive Goods"
    #     Then User should see Receive Goods Page
    #     When User selects the Organization as "<branch>"
    #     When User clicks on Continue
    #     Then User Should see "Order Number Barcode" dropdown
    #     When User enter the TransferOrder Number under receive goods page
    #     And User tabs out
    #     Then User should see the Shipment block and validate quantity to receive
    #     When User Clicks on receive all
    #     Then User should see New Receipt page for shipment
    #     When User clicks on Submit
    #     Then User should see the receipt dialog

    #     Examples:
    #         | branch        |
    #         | Peckham - 1BL |

    # @SCM
    # Scenario Outline: Validate Transfer Order Status  in SaaS after Received
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User click on "View all actions"
    #     Then User should see Actions pop up
    #     When User click on "Transfer Orders" under "Inventory Transactions"
    #     Then User should see "Transfer Orders" Page
    #     When Select the "Today" from filter
    #     And  User enter the Transfer Order Number
    #     Then Validate fulfillment status updated as "Shipped and received"
    #     When User clicks on TO from search results
    #     Then User should see the TO Page
    #     When User clicks on the product Link on TO search results Page
    #     Then User should see the Shipment and Receipt page and validate receipt Number

    #     Examples:
    #         | SubInventory                       |
    #         | WOLSELEY CENTERS DISTRIBUTION - F6 |

    # @SCM
    # Scenario Outline: Perform PutAway for the TO created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Put Away Goods"
    #     Then User should see Put Away Goods Page
    #     When User selects the Organization as "<branch>"
    #     When User clicks on Continue
    #     Then User Should see "Receipt Number Barcode" dropdown in Put Away Page
    #     When User enters the Receipt Number
    #     And User tabs out
    #     Then User should see the Shipment block
    #     When User clicks on Put Away All button
    #     And User clicks on Put Away
    #     Then User should see text "Put Away created"

    #     Examples:
    #         | branch        |
    #         | Peckham - 1BL |

    # @api
    # Scenario Outline: Create Customer Sales Order for "<product>" and branch "<DestinationOrg>"
    #     Given the API end point for Cutomer Sales Order API
    #     When user update the payload with SourceTransactionNumber,SourceTransactionID,"<product>","<DestinationOrg>","<quantity>"
    #     And User send the post request to the endpoint for Customer Sales Order
    #     Then User should have 201 response code

    #     Examples:
    #         | product | DestinationOrg | DestinationSubOrg | SourceOrg | quantity |
    #         | 100880  | 1BL            | 1BL               | F6        | 2        |


    # # Shipment Lines - Check Shipment Status = Ready To Release , [ Generate New Pick Wave ] Released to Warehouse --

    # @SCM
    # Scenario Outline: Validate Transfer Order Status  in SaaS after Received
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User Select "Shipment Lines" from Quick Access
    #     And User enter the TransferOrder Number under Shipment lines
    #     And User tabs out
    #     And User enter the Customer Sales Order Number
    #     Then User Should see Shipment Lines Page with Line Status as Ready to release
    #     When User clicks on Pick Release from More Actions
    #     Then User should see the status as "Released to warehouse"
    #     And User should Capture the ShipmentID


    #     Examples:
    #         | SubInventory  |
    #         | Peckham - 1BL |

    # ## Capture the Line Status - if its Interfaced or Staged then no need to perform Confirm Pick and Ship Confirm

    # @SCM
    # Scenario Outline: Validate Line Status after performing Pick Relase for the Transfer Order
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User Select "Shipment Lines" from Quick Access
    #     And User enter the TransferOrder Number under Shipment lines
    #     And User tabs out
    #     And User enter the Customer Sales Order Number
    #     Then User Should see Shipment Lines Page and capture Line Status

    #     Examples:
    #         | SubInventory  |
    #         | Peckham - 1BL |

    # #     #     # Confirm Pick
    # @conditionalSkipping
    # @SCM
    # Scenario Outline: Perform Confirm Pick for the TO created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Confirm Pick"
    #     Then User Should see Confirm Picks page
    #     When User selects the Organization as "<branch>"
    #     When User clicks on Continue
    #     Then User Should see Confirm Picks page
    #     When User selects "Order Number" from Advanced search
    #     And User enters Customer Sales Order Number
    #     And User tabs out
    #     Then User should see the tile contaning product information
    #     When User selects the tile for pick confirm
    #     And user enter subinventory code
    #     And User enter Item Number
    #     And User enters Picked Quantity
    #     And Click on Confirm Pick and Close

    #     Examples:
    #         | branch        |
    #         | Peckham - 1BL |

    # # ## Ship Goods
    # @conditionalSkipping
    # @SCM
    # Scenario Outline: Perform Ship Goods for the TO created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Ship Goods"
    #     Then User Should see Ship Goods page
    #     When User selects the Organization as "<branch>"
    #     And User clicks on Continue
    #     Then User Should see Ship Goods page
    #     When User enters Shipment Number from search By
    #     And User clicks on Continue
    #     Then User should see Shipment Page to ship goods
    #     When User clicks on Shipment Number tile
    #     And Validate Shipped quantity under Shipment Line Details
    #     And Click on Confirm Shipment

    #     Examples:
    #         | branch        |
    #         | Peckham - 1BL |