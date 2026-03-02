package com.enterprise.demo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Order Service - Enterprise Java Sample
 *
 * Production-quality service for managing orders with validation,
 * error handling, and business logic. Used in Module 2 exercises
 * for unit test generation with Copilot Chat.
 */
public class OrderService {

    public enum OrderStatus {
        PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }

    public record OrderItem(
            String productId,
            String productName,
            BigDecimal unitPrice,
            int quantity
    ) {
        public OrderItem {
            Objects.requireNonNull(productId, "Product ID cannot be null");
            Objects.requireNonNull(productName, "Product name cannot be null");
            Objects.requireNonNull(unitPrice, "Unit price cannot be null");
            if (unitPrice.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("Unit price cannot be negative");
            }
            if (quantity < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }
        }

        public BigDecimal lineTotal() {
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public record Order(
            String orderId,
            String customerId,
            List<OrderItem> items,
            OrderStatus status,
            LocalDate createdAt,
            String notes
    ) {}

    public record CustomerSpendingSummary(
            String customerId,
            BigDecimal totalSpent,
            int orderCount,
            BigDecimal averageOrderValue
    ) {}

    private final OrderRepository repository;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(OrderService.class);

    public OrderService(OrderRepository repository) {
        this.repository = Objects.requireNonNull(repository, "Repository cannot be null");
    }

    /**
     * Calculate the total for an order, applying a discount percentage.
     * Sum of (unitPrice * quantity) for all items, then apply discount.
     *
     * @param order           the order to calculate (must not be null)
     * @param discountPercent discount percentage between 0 and 100
     * @return total after discount, rounded to 2 decimal places
     * @throws IllegalArgumentException if order is null or discount is out of range
     */
    public BigDecimal calculateOrderTotal(Order order, int discountPercent) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        if (discountPercent < 0 || discountPercent > 100) {
            throw new IllegalArgumentException("Discount must be between 0 and 100");
        }

        if (order.items() == null || order.items().isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal subtotal = order.items().stream()
                .map(OrderItem::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (discountPercent > 0) {
            BigDecimal discountRate = BigDecimal.valueOf(100 - discountPercent)
                    .divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            subtotal = subtotal.multiply(discountRate);
        }

        return subtotal.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Filter orders by status.
     *
     * @param status the status to filter by
     * @return list of matching orders (may be empty)
     * @throws IllegalArgumentException if status is null
     */
    public List<Order> filterOrdersByStatus(OrderStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        log.info("Filtering orders by status: {}", status);

        List<Order> allOrders = repository.findAll();
        return allOrders.stream()
                .filter(order -> order.status() == status)
                .collect(Collectors.toList());
    }

    /**
     * Get orders within a date range (inclusive).
     *
     * @param startDate start of range (inclusive)
     * @param endDate   end of range (inclusive)
     * @return orders within range, sorted by createdAt ascending
     * @throws IllegalArgumentException if dates are null or startDate is after endDate
     */
    public List<Order> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must not be after end date");
        }

        log.info("Fetching orders between {} and {}", startDate, endDate);

        List<Order> allOrders = repository.findAll();
        return allOrders.stream()
                .filter(order -> !order.createdAt().isBefore(startDate) && !order.createdAt().isAfter(endDate))
                .sorted(Comparator.comparing(Order::createdAt))
                .collect(Collectors.toList());
    }

    /**
     * Get the top N customers by total spending.
     *
     * @param n number of top customers (must be >= 1)
     * @return list of customer summaries sorted by total spent descending
     */
    public List<CustomerSpendingSummary> getTopCustomers(int n) {
        if (n < 1) {
            throw new IllegalArgumentException("N must be at least 1");
        }

        List<Order> allOrders = repository.findAll();

        Map<String, List<Order>> ordersByCustomer = allOrders.stream()
                .collect(Collectors.groupingBy(Order::customerId));

        return ordersByCustomer.entrySet().stream()
                .map(entry -> {
                    String customerId = entry.getKey();
                    List<Order> customerOrders = entry.getValue();

                    BigDecimal totalSpent = customerOrders.stream()
                            .map(order -> calculateOrderTotal(order, 0))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    int orderCount = customerOrders.size();
                    BigDecimal average = totalSpent.divide(
                            BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP
                    );

                    return new CustomerSpendingSummary(customerId, totalSpent, orderCount, average);
                })
                .sorted(Comparator.comparing(CustomerSpendingSummary::totalSpent).reversed())
                .limit(n)
                .collect(Collectors.toList());
    }

    /**
     * Cancel an order if it is in a cancellable state (PENDING or PROCESSING).
     *
     * @param orderId the ID of the order to cancel
     * @return the cancelled order
     * @throws IllegalArgumentException if orderId is null
     * @throws IllegalStateException    if the order cannot be cancelled
     * @throws NoSuchElementException   if the order is not found
     */
    public Order cancelOrder(String orderId) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID cannot be null or blank");
        }

        Order order = repository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Order not found: " + orderId));

        if (order.status() != OrderStatus.PENDING && order.status() != OrderStatus.PROCESSING) {
            throw new IllegalStateException(
                    "Cannot cancel order in status: " + order.status()
            );
        }

        Order cancelledOrder = new Order(
                order.orderId(),
                order.customerId(),
                order.items(),
                OrderStatus.CANCELLED,
                order.createdAt(),
                "Cancelled at " + LocalDateTime.now()
        );

        repository.save(cancelledOrder);
        log.info("Order cancelled: {}", orderId);

        return cancelledOrder;
    }

    // Repository interface - typically injected via Spring
    public interface OrderRepository {
        List<Order> findAll();
        Optional<Order> findById(String orderId);
        Order save(Order order);
    }
}
