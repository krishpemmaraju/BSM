Feature: Validate Customer Credit limits



    @VBSOC @BSM
    Scenario Outline: Validate Credit Customer "<CreditCustomer>" status
        Given User login into VBCS Order Capture
        Then User should see Order Capture dashboard


    #     Examples:
    #         | CreditCustomer       | AccountStatus        | OCUIStatus           | HeaderDetails  |
    #         | SMITH AND BYFORD LTD | OK to Trade          | OK to Trade          | Account Status |
    #         | 7656H95              | Credit Services Stop | Credit Services Stop | Account Status |
    #         | 7000D63              | Overlimit Stop       | Overlimit Stop       | Account Status |


    @SCM @BSM
    Scenario: Validate Transfer Order created in SaaS
        Given User login into SCM application
        When User navigate to Order Management
        And User navigate to "Wolseley Order Capture" Sub section
        Then User should see Order Capture screen
        When Select customer as "<CreditCustomer>" to get "<HeaderDetails>"
        Then Should match with the Account Status as "<OCUIStatus>" on Order Capture UI
        And Available balance should display according to the "<AccountStatus>"


        Examples:
            | CreditCustomer       | AccountStatus        | OCUIStatus           | HeaderDetails  |
            | SMITH AND BYFORD LTD | OK to Trade          | OK to Trade          | Account Status |