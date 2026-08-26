/**
 * Applies pricing rules (bulk discounts, promo codes) to a shopping cart.
 *
 * NOTE FOR WORKSHOP: This module contains intentional defects for the
 * Debugging & Defect RCA exercises. Use it with the accompanying
 * runtime-output.log to practice root cause analysis with Copilot.
 */

/**
 * Custom error thrown when a promo code cannot be applied.
 */
class PromoCodeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PromoCodeError';
  }
}

const PROMO_CODES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
};

/**
 * Calculates the subtotal for a list of cart line items.
 * @param {Array<{price: number, quantity: number}>} items
 * @returns {number} subtotal before discounts
 */
function calculateSubtotal(items) {
  // Defect (RCA exercise 1): uses `+` on the accumulator without
  // initializing it, so the first iteration coerces undefined + number
  // into NaN, silently poisoning every subsequent total.
  let subtotal;
  for (const item of items) {
    subtotal += item.price * item.quantity;
  }
  return subtotal;
}

/**
 * Applies a percentage-based promo code discount to a subtotal.
 * @param {number} subtotal
 * @param {string} promoCode
 * @returns {number} the discounted total
 */
function applyPromoCode(subtotal, promoCode) {
  const discount = PROMO_CODES[promoCode];

  // Defect (RCA exercise 2): an unknown promo code should throw
  // PromoCodeError, but this comparison never matches because discount
  // is `undefined` (not `null`), so bad promo codes silently apply a
  // 0% discount instead of failing loudly.
  if (discount === null) {
    throw new PromoCodeError(`Unknown promo code: ${promoCode}`);
  }

  return subtotal * (1 - (discount ?? 0));
}

/**
 * Computes the final checkout total for a cart, applying bulk discounts
 * for orders of 10+ items and an optional promo code.
 * @param {Array<{price: number, quantity: number}>} items
 * @param {string} [promoCode]
 * @returns {number} final total
 */
function calculateCheckoutTotal(items, promoCode) {
  const subtotal = calculateSubtotal(items);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  let total = subtotal;
  if (totalQuantity >= 10) {
    total *= 0.95; // 5% bulk discount
  }

  if (promoCode) {
    total = applyPromoCode(total, promoCode);
  }

  return total;
}

module.exports = { calculateSubtotal, applyPromoCode, calculateCheckoutTotal, PromoCodeError };
