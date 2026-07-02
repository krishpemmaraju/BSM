Feature: Create customer sales order with product and fixed and variable kit respectively
 
    @VBSOC @BSM @Smoke
    Scenario Outline: Validate customer with fixed kit
        Given User login into VBCS Order Capture
        When Select customer as "<customer>"
        And Search  and add  "<product>" to the basket
        And Search and add "<kit>" to basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        Then User Should see "Confirmation" page
        
        Examples:
            |customer   | product  |kit     |
            |7106X96    | 508200   |L21065  |

    @VBSOC @BSM @Smoke
    Scenario Outline: Validate customer with variable kit
        Given User login into VBCS Order Capture
        When Select customer as "<customer>"
        And Search  and add  "<products>" to the basket
        And Search and add variable "<kit>" to basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        Then User Should see "Confirmation" page

        Examples:
            |customer | products   |kit    |
            |7106X96  | 508200     |333559 |
    

            