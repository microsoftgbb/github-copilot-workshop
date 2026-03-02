---
name: security-review
description: Perform a security-focused code review of the current file
agent: ask
tools: ['read', 'search']
---

Perform a thorough security review of the code in ${file}.

## Check for these categories:

### 1. Input Validation
- Missing or insufficient validation of user input
- Unvalidated data used in database queries, file paths, or system commands
- Type coercion vulnerabilities

### 2. Injection Risks
- SQL injection: string concatenation in queries
- XSS: unescaped output in HTML templates
- Command injection: user input in shell commands
- LDAP injection, XML injection, path traversal

### 3. Authentication & Authorization
- Missing authentication checks on endpoints
- Broken access control (IDOR vulnerabilities)
- Privilege escalation opportunities
- Insecure session management

### 4. Data Exposure
- Sensitive data in logs (PII, credentials, tokens)
- Excessive data in API responses
- Sensitive data in error messages or stack traces
- Missing encryption for data at rest or in transit

### 5. Cryptography
- Weak hashing algorithms (MD5, SHA1 for passwords)
- Hardcoded keys, secrets, or salts
- Insufficient key length or insecure modes

### 6. Dependency Patterns
- Known vulnerable library usage patterns
- Insecure deserialization
- Unsafe regex (ReDoS)

## Output Format

For each finding, provide:
- **Critical**: Must fix before merging
- **Warning**: Should fix soon
- **Info**: Best practice improvement

Include:
- **Location**: Specific file and code reference
- **Risk**: What could go wrong
- **Remediation**: Specific fix with code example
