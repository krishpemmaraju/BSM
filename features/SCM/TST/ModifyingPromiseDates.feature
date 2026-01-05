Feature: Update Promise dates

    # This feature validates the functionality of updating the promise dates for orders created
    # in Order Capture Custom UI

    @SCM
    Scenario Outline: Validate Promise Date Update for "<orderType>"
        Given User login into SCM application
        When  User navigate to Order Management
        And User navigate to "Order Management" Sub section
        And User clicks on Create Order
        Then User should see Create Order Page
        When User Select Customer as "<customer>"
        And User select Order Type as "<orderType>"
        And User search and add the product "<Item>"
        And User click on Shipment Details option
        Then User should see Shipment Details Page
        When User navigate to supply tab under Shipment Details
        And User enters "<Location>" in warehouse dropdown
        And User clicks on submit under Shipment Details
        Then User should see Sales Order Confirmation pop up
        And Capture the Requested Date for the Order Line
        When User clicks on OK
        And User select Create Revision under actions dropdown
       And User click on Shipment Details option
        # And User selects Override Order Line
        # Then User should see the Override Order Line pop up
        And User changes the Requested Date
        #And User clicks on Ok
        And User clicks on submit under Shipment Details
        Then User should see pop up "Your revised order was accepted and is being processed"
        And User clicks on Ok
        And User click on Shipment Details option
       Then User should see the Updated Requested Date under Order Line Details

        Examples:
            | customer                        | orderType    | Item   | Location |
            | WALKER PLUMBING & HEATING,88605 | Branch Order | R40003 | 1BL      |
