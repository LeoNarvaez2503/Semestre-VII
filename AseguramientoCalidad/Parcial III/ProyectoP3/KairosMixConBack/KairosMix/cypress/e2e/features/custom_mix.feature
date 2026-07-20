Feature: Custom Mix
  Background:
    Given I am logged in as admin
    And I open the "Mezcla Personalizada" section

  Scenario: Save a custom mix
    When I set mix name "Mix Test"
    And I add component with product code "A01" and quantity "1"
    And I save the mix without creating order
    Then I should see saved mix "Mix Test"
