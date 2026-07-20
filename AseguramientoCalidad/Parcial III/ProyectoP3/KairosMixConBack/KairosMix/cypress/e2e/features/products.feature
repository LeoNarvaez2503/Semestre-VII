Feature: Products
  Background:
    Given I am logged in as admin
    And I open the "Productos" section

  Scenario: Create edit delete product
    When I create a product:
      | name | Nueces Premium |
      | country | Chile |
      | pricePerPound | 25.50 |
      | wholesalePrice | 23.00 |
      | retailPrice | 29.99 |
      | initialStock | 150 |
    Then I should see product "Nueces Premium"
    When I update product "Nueces Premium" stock to "75"
    Then I should see stock "75 libras" for product "Nueces Premium"
    When I delete product "Nueces Premium"
    Then I should not see product "Nueces Premium"

  Scenario: Search product by name
    When I search for product "Almendras Premium"
    Then I should see a product found message
