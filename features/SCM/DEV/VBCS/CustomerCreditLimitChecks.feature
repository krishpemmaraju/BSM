Feature: Validate Customer Credit limits


    @VBSOC
    Scenario Outline: Validate Credit Customer "<CreditCustomer>" status
        Given User login into VBCS Order Capture
        Then User should see Order Capture dashboard
        When Select customer as "<CreditCustomer>" to get "<HeaderDetails>"
        Then Should match with the Account Status as "<OCUIStatus>" on Order Capture UI
        And Available balance should display according to the "<AccountStatus>"


        Examples:
            | CreditCustomer       | AccountStatus        | OCUIStatus           | HeaderDetails  |
            | SMITH AND BYFORD LTD | OK to Trade          | OK to Trade          | Account Status |
            | 7656H95              | Credit Services Stop | Credit Services Stop | Account Status |
            | 7000D63              | Overlimit Stop       | Overlimit Stop       | Account Status |
