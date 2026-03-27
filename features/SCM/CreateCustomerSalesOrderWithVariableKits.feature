Feature: Create Customer Sales Order with Fixed Kits
    ## This feature will create Customer Sales Order using Fixed Kits
    ## Perform Confirm Pick , Ship
    ## Validate Order Status after shipping
    ## Run SCM Invoic job to send the data to ODS
    ## Validate ODS file and validate status in SCM for the order

    @api @BSM
    Scenario: Create Customer Sales Order for Variable Kits with Parent Product "Parentproduct", Optional Product "VariableProduct", Child Product "ChildProduct" for branch "DestinationOrg"
        Given the API end point for Customer Order API
        When user update the variable kits payload with "Parentproduct","VariableProduct","ChildProduct","DestinationOrg","quantity","productPrice"
        And User execute post request for Variable Kits Customer Sales Order API
        Then user should receive 201 response code
        And capture the customer sales order single line response data
       
    @SCM @BSM
    Scenario:  Validate Order Created in SCM
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management (New)" Sub section
        And User clicks on "Manage Orders" under Actions menu
        Then User should see Manage Orders Page
        When User enters the customer sales order number
        And User clicks on search
        Then Capture the Kits products and quantities and should see order status as "Awaiting Shipping"

    @SCM @BSM
    Scenario: Validate Customer Sales Order Status  in SaaS after Received
        Given User login into SCM application
        When User Clicks on Home Icon
        And User navigate to Inventory Management
        And  Select the "SubInventory" on InventoryManagement Screen
        And User Select "Shipment Lines" from Quick Access
        And User enter the CustomerSalesOrder Number
        And User tabs out
        And User enter  CustomerSalesOrder Number under ShipmentLines
        Then User should see the status for Kits CustomerSalesOrder as "Released to warehouse"
        And User should Capture ShipmentID for CustomerSalesOrder created for kits

@SCM @BSM
Scenario: Perform Confirm Pick for the Customer Sales Order created
    Given User login into SCM application
    When User Clicks on Home Icon
    And User navigate to Inventory Execution
    And User Clicks on "Confirm Pick"
    Then User Should see Confirm Picks page
    When User selects the Organization as "branch"
    When User clicks on Continue
    Then User Should see Confirm Picks page
    When User selects "Order Number" from Advanced search
    And User enters CustomerSalesOrder Number
    And User tabs out
    Then User should see the tiles contaning product and "branch" information
    # When User selects Pick All Items
    # Then User should see Confirm Pick and Next option
    When User enter subinventory info as "branch" products , picked quantity for all products in Customer Sales Order
    # And Click on Confirm Pick and Close

@SCM @BSM
Scenario: Perform Ship Goods for the Customer Sales Order created
    Given User login into SCM application
    When User Clicks on Home Icon
    And User navigate to Inventory Execution
    And User Clicks on "Ship Goods"
    Then User Should see Ship Goods page
    When User selects the Organization as "branch"
    And User clicks on Continue
    Then User Should see Ship Goods page
    When User enters Shipment Number for Kits Customer Sales Order
    And User clicks on Continue
    Then User should see Shipment page to ship goods for multi line products
    When User clicks on Shipment Number tile for Multiline products and validate Shipped quantity under Shipment Line Data
    And Click on Confirm Shipment for Customer SO


@SCM @BSM
Scenario Outline: Validate Customer Sales Order Status  in SaaS after Shipped
    Given User login into SCM application
    When User Clicks on Home Icon
    And User navigate to Inventory Management
    And  Select the "SubInventory" on InventoryManagement Screen
    And User Select "Shipment Lines" from Quick Access
    And User enter the CustomerSalesOrder Number
    And User tabs out
    And User enter  CustomerSalesOrder Number under ShipmentLines
    Then User should see the status for Kits CustomerSalesOrder as "Interfaced"
    And User should validate shipped quantity for Kits Customer Sales Order


@SCM @BSM
Scenario:  Validate Order Created in SCM after shipped and status is 'Awaiting Invoice'
    Given User login into SCM application
    When  User navigate to Order Management
    And User navigate to "Order Management (New)" Sub section
    And User clicks on "Manage Orders" under Actions menu
    Then User should see Manage Orders Page
    When User enters the customer sales order number
    And User clicks on search
    Then User should see the order status as "Awaiting Invoice"


@SCM @BSM
Scenario: Run BSM Invoice Job to send invoice details to ODS
    Given User login into SCM application
    When User Clicks on Home Icon
    And User navigate to Tools
    And User Clicks on Scheduled Processes
    Then User should see Scheduled processes page
    When User Clicks on Schedule New Processes
    Then User should see Shcedule New Process page
    When User search for the job "jobName"
    Then User should see Process details
    When User fill the details "subinventory"
    And User clicks on submit
    Then Capture the processID
    When User search for the process
    Then User should see the status as succeeded

@MFT @BSM
Scenario: Validate Invoice File Upload in MFT
    Given User login into MFT application
    When User click on Navigate
    And User enter "devfolderpath"
    Then User should see the file "fileName" under the path


@DB
Scenario:
    Given user login into ODS
    When User run the query to validate invoice transactions
    Then User should see the results with the order results


@SCM @BSM
Scenario:  Validate Order Created in SCM after shipped and status is 'ODSAcknowledged'
    Given User login into SCM application
    When  User navigate to Order Management
    And User navigate to "Order Management (New)" Sub section
    And User clicks on "Manage Orders" under Actions menu
    Then User should see Manage Orders Page
    When User enters the customer sales order number
    And User clicks on search
    Then User should see the order status as "ODSAcknowledged"
