Feature: Updating customer account number
 
    @VBSOC @BSM @Smoke
    Scenario Outline: Validate  that the customer account number is getting updated
        Given User login into VBCS Order Capture
        When Select customer as "<customer1>"
        And Search  and add  "<products>" to the basket
        And Update the customer name to "<customer2>"
        Then User should be able to see the updated account number and name


    Examples:
    | customer1  | customer2  | products |
    | 7106X96    | 7060F14    | R40001   |