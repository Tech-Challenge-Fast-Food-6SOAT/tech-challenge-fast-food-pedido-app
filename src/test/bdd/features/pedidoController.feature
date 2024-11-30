Feature: BDD - PedidoController: buscarPedidos

  Scenario: Get all pedidos
    Given at least one pedido exists
    When I call the buscarPedidos
    Then the response status code should be "200"
    And I should receive a list of pedidos

  Scenario: There are no pedidos
    Given no pedidos exist
    When I call the buscarPedidos
    Then the response status code should be "200"
    And I should receive an empty list

  Scenario: Receive an error
    Given an error occurs when fetching pedidos
    When I call the buscarPedidos
    Then the response status code should be "500"
    And I should receive an error message
