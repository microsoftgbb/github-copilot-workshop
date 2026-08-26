Feature: Shopping cart discount eligibility
  As an online store
  I want to apply the correct discount tier to a customer's cart
  So that loyalty and bulk discounts are applied consistently at checkout

  Background:
    Given the store has the following discount tiers:
      | tier   | minimum_items | minimum_subtotal | discount_percent |
      | none   | 0              | 0                 | 0                |
      | bulk   | 10             | 0                 | 5                |
      | vip    | 0              | 500               | 15               |

  Scenario: Cart qualifies for no discount
    Given a cart with 2 items and a subtotal of $40.00
    When the discount tier is calculated
    Then the applied discount tier should be "none"
    And the discount percent should be 0

  Scenario: Cart qualifies for the bulk discount by item count
    Given a cart with 12 items and a subtotal of $90.00
    When the discount tier is calculated
    Then the applied discount tier should be "bulk"
    And the discount percent should be 5

  Scenario: Cart qualifies for the VIP discount by subtotal
    Given a cart with 3 items and a subtotal of $650.00
    When the discount tier is calculated
    Then the applied discount tier should be "vip"
    And the discount percent should be 15

  Scenario: Cart qualifies for both bulk and VIP thresholds
    Given a cart with 15 items and a subtotal of $700.00
    When the discount tier is calculated
    Then the applied discount tier should be "vip"
    And the discount percent should be 15

  Scenario Outline: Boundary conditions are inclusive
    Given a cart with <items> items and a subtotal of $<subtotal>
    When the discount tier is calculated
    Then the applied discount tier should be "<expected_tier>"

    Examples:
      | items | subtotal | expected_tier |
      | 10    | 0.00     | bulk          |
      | 9     | 0.00     | none          |
      | 0     | 500.00   | vip           |
      | 0     | 499.99   | none          |
