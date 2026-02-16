Feature: Create Customer Sales Order Using API and Perform Full and Partial shipment

    # This feature will create Customer Sales Orders and Perform Full , Partial shipping

    @api
    Scenario Outline: Create Customer Sales Order for "<product>" for branch "<DestinationOrg>"
        Given the API end point for Customer Order API
        When user update the payload with "<product>","<DestinationOrg>","<quantity>","<productPrice>"
        And User execute post request for Customer Sales Order API
        Then user should receive 201 response code
        Examples:
            | product | DestinationOrg | quantity | productPrice |
            | 508866  | 1BL            | 2        | 35.04        |

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
    


    