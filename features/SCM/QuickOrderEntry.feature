Feature: Quick Order Entry

    @SCM
    Scenario Outline: Create Account Sales in Order Capture UI using Quick Order Manual Entry
        Given User login into SCM application
        When User navigate to Wolseley Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And  Click on Quick Order Entry option
        Then User should see Quick Order Entry pane
        When  Enter the products as "<products>" and Add to Basket
        And User clicks on submit
        Then User should see Checkout popup
        When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page

        Examples:
            | customer         | products      | PrintVerification |
            | SMITH AND BYFORD | 128803        | No                |
            | SMITH AND BYFORD | 128803,608955 | Yes               |

    @SCM
    Scenario Outline: Create Account Sales in Order Capture UI using Quick Order Entry with file upload
        Given User login into SCM application
        When User navigate to Wolseley Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And  Click on Quick Order Entry option
        Then User should see Quick Order Entry pane
        When User clicks on file upload to upload file
        And User Clicks on Add To Basket
        And User clicks on submit
        Then User should see Checkout popup
        When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page

        Examples:
            | customer         | PrintVerification |
            | SMITH AND BYFORD | No                |
        #    | SMITH AND BYFORD | Yes               |