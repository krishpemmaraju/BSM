Feature: Update Promise dates

    # This feature validates the functionality of updating the promise dates for orders created
    # in Order Capture Custom UI

    @SCM
    Scenario Outline: Validate Promise Date Update for "<orderType>"
        Given User login into VBCS Order Capture
        Then User should see Order Capture dashboard
        When User login into SCM application
        And  User navigate to Order Management
        And User navigate to "Wolseley Order Capture" Sub section
        Then User should see header "Order Capture" page
        # When User clicks on Create Order
        # Then User should see Create Order page
        When User select customer as "<customer>"
        And Select order type as "<orderType>"
        When User enter item as "<item>"
        And click on Add
        Then User should see "<item>" in item search results
        When User clicks on submit on Create Order Page
        And User should see Confirmation pop with order number
        When User clicks on Done on Create Order Page
        Then User should see Order Management page
        When User search for the order created above
        Then User should see the Manage Order page with Order created

        Examples:
            | customer | orderType    | item   |
            | 7060F14  | Branch Order | R40003 |
