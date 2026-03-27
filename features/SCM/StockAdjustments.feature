Feature: Stock Adjustments

    @SCM @BSM
    Scenario: Validate Account Alias Receipt Transaction
        Given User login into SCM application
        When User navigate to Inventory Management
        And  Select the "SubInventory" on InventoryManagement Screen
        And  User clicks on Item Quantities- under Actions
        And  User enter "Products" to search for existing availability
        Then User should see deatils of existing stock values
        When  User clicks on Create Miscellaneous Transactions
        Then User should see "Miscellaneous Transactions" dashboard
        When User clicks on Edit icon
        And  User select Transaction Type for receipt as "<Transaction>" and Account Alias as "WUK" and click on Save
        Then User should see option to "Add Item"
        When User clicks on "Add Item" button
        And  User enter product as "Products"
        And  User select subinventory as "SubInventoryAdj" and Locator as "Locator"
        And  User enter quantity receipt as "quantity"
        And  User select reason code as "ReasonCode" from Additional Fields
        And  User enter Product Reference as "Product Change code Transaction"
        And  User clicks on Done
        Then User should see "Miscellaneous Transactions" dashboard with line details
        When User clicks on Submit
        Then User should see pop up as "Item received"


    @SCM @BSM
    Scenario: Validate "Account Alias Issue Transaction"
        Given User login into SCM application
        When User navigate to Inventory Management
        And  Select the "SubInventory" on InventoryManagement Screen
        And  User clicks on Item Quantities- under Actions
        And  User enter "Products" to search for existing availability
        Then User should see deatils of existing stock values
        When  User clicks on Create Miscellaneous Transactions
        Then User should see "Miscellaneous Transactions" dashboard
        When User clicks on Edit icon
        And  User select Transaction Type for issue as "Transaction" and Account Alias as "WUK" and click on Save
        Then User should see option to "Add Item"
        When User clicks on "Add Item" button
        And  User enter product as "Products"
        And  User select subinventory as "SubInventoryAdj" and Locator as "Locator"
        And  User enter quantity issue as "quantity"
        And  User select reason code as "ReasonCode" from Additional Fields
        And  User enter Product Reference as "Product Change code Transaction"
        And  User clicks on Done
        Then User should see "Miscellaneous Transactions" dashboard with line details
        When User clicks on Submit
        Then User should see pop up as "items issued"