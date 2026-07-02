Feature: Create customer sales order single line
 
    @VBSOC @BSM @Smoke
    Scenario Outline: Validate  customer sales order for "products" in single line with cash payment
        Given User login into VBCS Order Capture
        When Select customer as "<customer>"
        And Search  and add  "<products>" to the basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        Then Capture the Order Number
        Then User Should see "Confirmation" page
        Then User Should see "Create Shipment" button
       

        Examples:
            | customer   | products |
            | 7106X96    | R40001   |

        @VBSOC @BSM @Smoke
        Scenario Outline: Validate VPED page is visible for card payment
            Given User login into VBCS Order Capture
            When Select customer as "<customer>"
            And Search  and add  "<products>" to the basket
            And Add delivery address
            And User clicks on checkout button
            Then User should see Checkout Page
            Then User should choose card payment
            Then User should tick the checkbox
            And User Click on Place Order
            Then User should see the VPED page
        
            Examples:
                | customer  | products |
                | 7106X96   | R40001   |

    @VBSOC @BSM @Smoke
        Scenario Outline: Validate  customer sales order for "products" in multi line with cash payment
        Given User login into VBCS Order Capture
        When Select customer as "<customer>"
        And Search  and add  "<products>" to the basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        Then Capture the Order Number
        Then User Should see "Confirmation" page
        Then User Should see "Create Shipment" button

        Examples:
            | customer | products        |
            | 7106X96  | R40001,R40063   |