Feature: Reality Login Check Validation

@reality
Scenario: Call Center Validation Checks
 Given User select the DBHost as "Moon-10"
 When User login with valid "username" and "password"
 Then User should see "Development Menu" menu
 When User enters option for Logto Branch as "SB"
 Then User should see "TOP LEVEL MENU" menu
 When User enter option for "Sales Order Processing"
 Then User should see "Sales Order Entry/Amendment" menu