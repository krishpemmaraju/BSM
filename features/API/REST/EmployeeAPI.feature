Feature: Validate Employee API 

Background: 
   Given user has access to the Employee Retrival System

@api
Scenario: Get the employee information 
   When user query the employee information with id as "U44506"
   Then user should see the employee list
   And user should get a status code as 200

@api
Scenario: Create employee data
   When user invokes empcreation endpoint with valid data
   Then user see employee data created
   And user should get a status code as 200

@api
Scenario: Update employee data
   When user invokes empupdate endpoint with valid data
   Then user see employee data updated successfully
   And user should get a status code as 200

@api
Scenario: Delete employee data
   When user invokes empdelete endpoint with valid data
   Then user see employee data deleted successfully
   And user should get a status code as 200