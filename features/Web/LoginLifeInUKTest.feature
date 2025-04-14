Feature: Life in UK website check

@webui
Scenario: Valdiate Life in UK Test page
Given User landed on Life in UK webpage
When User click on Tests
Then User should see "Life in the UK Tests" page
When User clicks on any test exam 
Then User should see the exam page with choice question
When User selects a option for the question and click on check
Then User should see Next button enabled if "Correct"
And User should see Previous button enabled if "Previous"