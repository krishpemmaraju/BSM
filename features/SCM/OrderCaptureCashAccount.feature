Feature: Create Account Order in Order Capture UI

    @SCM
    Scenario Outline: Create Account Sales in Order Capture UI for "<products>" with Shipping method as "Collection"
        Given User login into SCM application
        When User navigate to Wolseley Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search for "<products>"
        And add products "<products>" to the basket
        Then User should see "<products>" added to the basket list
        When User clicks on submit
        Then User should see Checkout popup
        When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page

        Examples:
            | customer         | products      | PrintVerification |
            | SMITH AND BYFORD LTD | 128803        | No                |
             | SMITH AND BYFORD LTD | 128803,608955 | Yes               |
