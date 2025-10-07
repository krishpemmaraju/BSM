Feature: Create Account Order in Order Capture UI

    @VBSOC
    Scenario Outline: Create Account Sales in Order Capture UI for "<products>" with Shipping method as "Collection"
        Given User login into VBCS Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search  and add  "<products>" to basket
        And User clicks on submit
        Then User should see Checkout popup
        When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page

        Examples:
            | customer             | products      | PrintVerification |
           | SMITH AND BYFORD LTD | 508201        | No                |
            | SMITH AND BYFORD LTD | 508201,608955 | Yes               |
    
