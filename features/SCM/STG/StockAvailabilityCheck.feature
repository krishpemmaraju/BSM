Feature: Create Account Order in Order Capture UI

    @VBSOC
    Scenario Outline: Validate Stock Availability Check for "<products>" for Organization "<branch>"
        Given User login into VBCS Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search  and add  "<products>" to basket
        Then get the stock of the "<products>" added to the basket
        When user invokes Stock Availability Check API for the "<products>" and "<branch>"
        Then stock number in response should match the data in UI
        When user invokes Quick Availability Check API for the "<products>" and "<branch>"
        Then extract the ExpectedShipDateTime from the response

        Examples:
            | customer         | products | branch |
            | SMITH AND BYFORD LTD | R40003   | 1BL    |