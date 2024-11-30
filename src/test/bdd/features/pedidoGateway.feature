Feature: BDD - PedidoGateway: buscarPedidos

  Scenario: Get all pedidos
    Given at least one pedido exists
    When I call the buscarPedidos
    Then I should receive a list of pedidos

  Scenario: There are no pedidos
    Given no pedidos exist
    When I call the buscarPedidos
    Then I should receive an empty list of pedidos
