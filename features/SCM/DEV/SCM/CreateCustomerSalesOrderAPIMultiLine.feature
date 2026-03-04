Feature: Create Customer Sales Order Using API and Perform Full and Partial shipment

    # This feature will create Customer Sales Orders and Perform Full , Partial shipping

    @api
    Scenario Outline: Create Multi Line Customer Sales Order for "<product>", "<product1>" for branch "<DestinationOrg>"
        Given the API end point for Customer Order API
        When user update the multilines payload with "<product>","<product1>","<DestinationOrg>","<quantity>","<productPrice>","<productPrice1>"
        And User execute post request for Multilines Customer Sales Order API
        Then user should receive 201 response code
        And Capture the response data for multiple customer sales order
        Examples:
            | product | product1 | DestinationOrg | quantity | productPrice | productPrice1 |
            | 123305  | 123306   | 1BL            | 1        | 35.04        | 53.09         |

    @SCM
    Scenario:  Validate Order Created in SCM
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management (New)" Sub section
        And User clicks on "Manage Orders" under Actions menu
        Then User should see Manage Orders Page
        When User enters the customer sales order number for multiline order
        And User clicks on search
        Then User should see the order status as "Awaiting Shipping" for all products

    # @SCM
    # Scenario Outline: Validate Customer Sales Order Status  in SaaS after Received
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<SubInventory>" on InventoryManagement Screen
    #     And User Select "Shipment Lines" from Quick Access
    #     And User enter the Multiline CustomerSalesOrder Number
    #     And User tabs out
    #     And User enter  CustomerMultiLineSalesOrder Number under ShipmentLines
    #     Then User Should see Shipment Lines Page for products "<product1>" , "<product2>" with Line Status as Ready to release
    #     When User clicks on Pick Release from More Actions
    #     Then User should see the status for CustomerSalesOrder as "Released to warehouse" for products "<product1>" , "<product2>"
    #     And User should Capture ShipmentID for CustomerSalesOrder for products "<product1>","<product2>"

    #     Examples:
    #         | SubInventory  | product1 | product2 |
    #         | Peckham - 1BL | 123305   | 123306   |

    # @SCM
    # Scenario Outline: Perform Confirm Pick for the Customer Sales Order created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Confirm Pick"
    #     Then User Should see Confirm Picks page
    #     When User selects the Organization as "<branch>"
    #     When User clicks on Continue
    #     Then User Should see Confirm Picks page
    #     When User selects "Order Number" from Advanced search
    #     And User enters  CustomerSalesOrder Number for MultiLine
    #     And User tabs out
    #     Then User should see the tiles contaning "<product1>" and "<product2>" and "<branch>" information
    #     When User selects Pick All Items
    #     Then User should see Confirm Pick and Next option
    #     When User enter subinventory info as "<branch>" , "<product1>", "<product2>", picked quantity  for all products in Customer Sales Order
    #     # And Click on Confirm Pick and Close

    #     Examples:
    #         | branch        | product1 | product2 |
    #         | Peckham - 1BL | 123305   | 123306   |

    # @SCM
    # Scenario Outline: Perform Ship Goods for the Customer Sales Order created
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Execution
    #     And User Clicks on "Ship Goods"
    #     Then User Should see Ship Goods page
    #     When User selects the Organization as "<branch>"
    #     And User clicks on Continue
    #     Then User Should see Ship Goods page
    #     When User enters Shipment Number for Customer Sales Order for MultiLine product "<product1>","<product2>"
    #     And User clicks on Continue
    #     Then User should see Shipment page to ship goods for products "<product1>","<product2>"
    #     When User clicks on Shipment Number tile for products "<product1>","<product2>" and validate the shipment Quantity
    #     And Click on Confirm Shipment for Customer SO

    #     Examples:
    #         | branch        | product1 | product2 |
    #         | Peckham - 1BL | 123305   | 123306   |

    # @SCM
    # Scenario Outline: Validate Customer Sales Order Status  in SaaS after Shipped
    #     Given User login into SCM application
    #     When User Clicks on Home Icon
    #     And User navigate to Inventory Management
    #     And  Select the "<branch>" on InventoryManagement Screen
    #     And User Select "Shipment Lines" from Quick Access
    #     And User enter the Multiline CustomerSalesOrder Number
    #     And User tabs out
    #     Then User should see the status for CustomerSalesOrder as "Interfaced" for products "<product1>" , "<product2>"
    #     And User should validate shipped quantity for Customer Sales Order for products "<product1>" , "<product2>"

    #     Examples:
    #         | branch        | product1 | product2 |
    #         | Peckham - 1BL | 123305   | 123306   |

