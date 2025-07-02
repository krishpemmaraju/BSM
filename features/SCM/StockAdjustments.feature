Feature: Stock Adjustments

    @SCM
    Scenario Outline: Validate "<Transaction>" for "<Products>"
        Given User login into SCM application
        When User navigate to Inventory Management
        And  User clicks on Item Quantities- under Actions
        And  User enter "<Products>" to search for existing availability
        Then User should see deatils of existing stock values
        When  User clicks on Create Miscellaneous Transactions
        Then User should see "Miscellaneous Transactions" dashboard
        When User clicks on Edit icon
        And  User select Transaction Type as "<Transaction>" and Account Alias as "WUK" and click on Save
        Then User should see option to "Add Item"
        When User clicks on "Add Item" button
        And  User enter product as "<Products>"
        And  User select subinventory as "<SubInventory>"
        And  User enter quantity as "<quantity>"
        And  User select reason code as "<ReasonCode>" from Additional Fields
        And  User enter Product Reference as "Product Change code <Transaction>"
        And  User clicks on Done
        Then User should see "Miscellaneous Transactions" dashboard with line details
        When User clicks on submit
        Then User should see pop up as "Item received"


        Examples:
            | Products | ReasonCode | Transaction           | SubInventory | quantity |
            | 508200   | B          | Account Alias Receipt | 1BL          | 1        |

    # @SCM
    # Scenario Outline: Validate "<Transaction>" for "<Products>"
    #     Given User login into SCM application
    #     When User navigate to Inventory Management
    #     And  User clicks on Item Quantities- under Actions
    #     And  User enter "<Products>" to search for existing availability
    #     Then User should see deatils of existing stock values
    #     When  User clicks on Create Miscellaneous Transactions
    #     Then User should see "Miscellaneous Transactions" dashboard
    #     When User clicks on Edit icon
    #     And  User select Transaction Type as "<Transaction>" and Account Alias as "WUK" and click on Save
    #     Then User should see option to "Add Item"
    #     When User clicks on "Add Item" button
    #     And  User enter product as "<Products>"
    #     And  User select subinventory as "<SubInventory>"
    #     And  User enter quantity as "<quantity>"
    #     And  User select reason code as "<ReasonCode>" from Additional Fields
    #     And  User enter Product Reference as "Product Change code <Transaction>"
    #     And  User clicks on Done
    #     Then User should see "Miscellaneous Transactions" dashboard with line details
    #     When User clicks on submit
    #     Then User should see pop up as "items issued"


    #     Examples:
    #         | Products | ReasonCode | Transaction         | SubInventory | quantity |
    #         | 508200   | B          | Account Alias Issue | 1BL          | 1        |