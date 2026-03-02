---
applyTo: "**/*.java"
---

# Java Coding Standards

- Use Java 17 features: records for DTOs, sealed interfaces, pattern matching for instanceof
- All public methods require Javadoc with @param, @return, and @throws tags
- Use constructor injection via final fields (never @Autowired on fields)
- Return Optional<T> instead of null for single-value lookups
- Use Stream API for collection processing
- Use BigDecimal for monetary values with RoundingMode.HALF_UP
- Throw IllegalArgumentException for invalid method parameters
- Log with SLF4J parameterized messages: log.info("Processing {}", id)
- Name test methods: givenX_whenY_thenZ
- Use AssertJ assertions: assertThat(result).isEqualTo(expected)
