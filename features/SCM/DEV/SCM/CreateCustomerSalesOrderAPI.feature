Feature: Create Customer Sales Order Using API and Perform Full and Partial shipment

    # This feature will create Customer Sales Orders and Perform Full , Partial shipping

    @api
    Scenario Outline: Create Customer Sales Order for "<product>" for branch "<DestinationOrg>"
        Given the API end point for Customer Order API
        When user update the payload with "<product>","<DestinationOrg>","<quantity>","<productPrice>"
        And User execute post request for Customer Sales Order API
        Then user should receive 201 response code
        Examples:
            | product | DestinationOrg | quantity | productPrice |
            | 123305  | 1BL            | 2        | 74.63        |