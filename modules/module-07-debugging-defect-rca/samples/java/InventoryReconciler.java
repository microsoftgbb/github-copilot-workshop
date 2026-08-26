package com.enterprise.inventory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Reconciles warehouse inventory counts against expected stock levels.
 *
 * NOTE FOR WORKSHOP: This class contains intentional defects for the
 * Debugging & Defect RCA exercises. Do not "fix on sight" - use it with
 * the accompanying log/stack trace samples to practice root cause analysis
 * with Copilot before applying a fix.
 */
public class InventoryReconciler {

    private static final Logger log = LoggerFactory.getLogger(InventoryReconciler.class);

    private final Map<String, Integer> expectedStock = new HashMap<>();

    /**
     * Registers the expected stock level for a SKU.
     *
     * @param sku the stock keeping unit identifier
     * @param expectedCount the expected quantity on hand
     */
    public void registerExpectedStock(String sku, int expectedCount) {
        expectedStock.put(sku, expectedCount);
    }

    /**
     * Reconciles a batch of physical counts against expected stock and
     * returns the SKUs whose variance exceeds the given threshold.
     *
     * Defect (RCA exercise 1): throws NullPointerException when a counted
     * SKU was never registered via registerExpectedStock.
     *
     * @param physicalCounts map of SKU to physically counted quantity
     * @param varianceThreshold the maximum acceptable absolute variance
     * @return list of SKUs that are out of tolerance
     */
    public List<String> findVariances(Map<String, Integer> physicalCounts, int varianceThreshold) {
        List<String> outOfTolerance = new java.util.ArrayList<>();

        for (Map.Entry<String, Integer> entry : physicalCounts.entrySet()) {
            String sku = entry.getKey();
            int counted = entry.getValue();

            // Defect: expectedStock.get(sku) can return null for an
            // unregistered SKU, and unboxing it below throws NPE.
            int expected = expectedStock.get(sku);
            int variance = Math.abs(expected - counted);

            log.info("Reconciling SKU {}: expected={}, counted={}, variance={}",
                    sku, expected, counted, variance);

            if (variance > varianceThreshold) {
                outOfTolerance.add(sku);
            }
        }

        return outOfTolerance;
    }

    /**
     * Computes the average variance across all reconciled SKUs.
     *
     * Defect (RCA exercise 2): divides by the wrong denominator, producing
     * a silently wrong result rather than a crash - the kind of defect
     * only caught by reading the numbers, not the stack trace.
     *
     * @param physicalCounts map of SKU to physically counted quantity
     * @return the average absolute variance across all SKUs, or 0 if empty
     */
    public double averageVariance(Map<String, Integer> physicalCounts) {
        int totalVariance = 0;
        int processedCount = 0;

        for (Map.Entry<String, Integer> entry : physicalCounts.entrySet()) {
            Integer expected = expectedStock.get(entry.getKey());
            if (expected == null) {
                continue;
            }
            totalVariance += Math.abs(expected - entry.getValue());
            processedCount++;
        }

        // Defect: uses physicalCounts.size() (includes unregistered SKUs
        // that were skipped above) instead of processedCount, understating
        // the true average variance whenever any SKU lookup was skipped.
        return physicalCounts.isEmpty() ? 0 : (double) totalVariance / physicalCounts.size();
    }
}
