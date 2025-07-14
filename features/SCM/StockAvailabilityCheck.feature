Feature: Create Account Order in Order Capture UI

    @SCM
    Scenario Outline: Create Account Sales in Order Capture UI for "<products>" with Shipping method as "Collection"
        Given User login into SCM application
        When User navigate to Wolseley Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search for "<products>"
        And add products "<products>" to the basket
        Then get the stock of the "<products>" added to the basket
        When user invokes Stock Availability Check API for the "<products>" and "<branch>"
        Then stock number in response should match the data in UI
        When user invokes Quick Availability Check API for the "<products>" and "<branch>"
        Then extract the ExpectedShipDateTime from the response 

        Examples:
            | customer         | products      | branch|
            | SMITH AND BYFORD | 128803        | 1BL |