Feature: Orders
  Background:
    Given I am logged in as admin
    And I open the "Pedidos" section

  Scenario: Create basic order
    When I create an order for client id "1234567890" with product code "A01" quantity "2"
    Then I should see at least one order

  Scenario: Change status and delete an order
    When I change status for order id "1" to "En Proceso"
    Then I should see order id "1" with status "En Proceso"
    When I delete order id "1"
    Then I should not see order id "1"
