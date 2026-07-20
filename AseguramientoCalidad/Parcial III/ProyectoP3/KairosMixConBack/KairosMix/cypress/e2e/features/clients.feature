Feature: Clients
  Background:
    Given I am logged in as admin
    And I open the "Clientes" section

  Scenario: Create search delete client
    When I create a client:
      | name | Test Cliente |
      | idType | cedula |
      | idNumber | 0912345678 |
      | email | test@cliente.com |
      | phone | 0991234567 |
      | address | Calle 1 |
    Then I should see client "Test Cliente"
    When I search for client id "0912345678"
    Then I should see a client found message
    When I delete client "Test Cliente"
    Then I should not see client "Test Cliente"
