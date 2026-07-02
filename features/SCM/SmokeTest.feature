Feature: Smoke Test
 
    @VBSOC @BSM @Smoke
    Scenario Outline:Splitting of buckets
        Given User login into VBCS Order Capture
        When Select customer as "<customer>"
        And Search  and add  "<product1>" to the basket
        And Search and add "<kit>" to basket
        And Search  and add  "<product2>" to the basket
        And Increment the product qty
        And Decrement the product qty
        Then Delete the product qty
        And Add delivery address for 508200
        Then User should see collect bucket and a delivery bucket

        Examples:
        | customer    | product1   |kit     |product2  |
        | 7106X96     | 508200     |L21065  |R40001    |

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

    