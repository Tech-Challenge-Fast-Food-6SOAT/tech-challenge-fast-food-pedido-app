Feature: BDD - apiRoutes: /pedidos

  Scenario: Get all pedidos
    Given at least one pedido exists
    When I send a GET request to /pedidos
    Then the response status code should be "200"
    And the response should be a list of pedidos

  Scenario: There are no pedidos
    Given no pedidos exist
    When I send a GET request to /pedidos
    Then the response status code should be "200"
    And the response should be an empty list
