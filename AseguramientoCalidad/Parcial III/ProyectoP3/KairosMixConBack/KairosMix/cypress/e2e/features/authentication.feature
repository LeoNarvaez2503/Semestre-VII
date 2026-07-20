Feature: Authentication
  Scenario: Admin can access products
    Given I am logged in as admin
    Then I should be on "/productos"
