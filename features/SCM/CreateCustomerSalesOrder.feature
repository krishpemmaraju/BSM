Feature: Create customer sales order single line
 
    @VBSOC @BSM
    Scenario Outline: Validate  customer sales order for "products" in single line with card payment
        Given User login into VBCS Order Capture
        # When User login into SCM application
        # Then User Clicks on Home Icon
        # Then User navigate to Order Management
        # And User navigate to "Wolseley Order Capture" Sub section        
        # Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search  and add  "<products>" to basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        # When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page
        Then User Should see "Create Shipment" button
       
 
        Examples:
            | customer             | products |
            | SMITH AND BYFORD LTD | R40001   |


    @VBSOC
        Scenario Outline: Validate  customer sales order for "products" in multi line with card payment
        Given User login into VBCS Order Capture
        # When User login into SCM application
        # Then User Clicks on Home Icon
        # Then User navigate to Order Management
        # And User navigate to "Wolseley Order Capture" Sub section        
        # Then User should see Order Capture dashboard
        When Select customer as "<customer>"
        And Search  and add  "<products>" to basket
        And Add delivery address
        And User clicks on checkout button
        Then User should see Checkout Page
        Then User should choose account payment
        And User Click on Place Order
        # When User Clicks on Confirm depends on "<PrintVerification>"
        Then Capture the Order Number
        Then User Should see "Order Confirmation" page
        Then User Should see "Create Shipment" button

        Examples:
            | customer             | products        |
            | SMITH AND BYFORD LTD | R40001,R40063   |
    
