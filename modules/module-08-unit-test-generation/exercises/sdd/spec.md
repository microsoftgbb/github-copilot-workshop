# Spec: Password Reset Token Service

> Spec-Driven Development (SDD) starter. This is the **spec**, written before
> any code. In the exercise, Copilot will be asked to generate an
> implementation plan from this spec, then implementation + tests +
> documentation from that plan - in that order, so the spec stays the
> single source of truth.

## Purpose

Generate and validate short-lived, single-use password reset tokens for the
user account service.

## Functional Requirements

- FR1: `generateResetToken(userId)` returns a random, URL-safe token string
  and stores it with an expiry of 15 minutes from creation.
- FR2: `validateResetToken(token)` returns the associated `userId` if the
  token exists and has not expired or already been used.
- FR3: `validateResetToken(token)` returns nothing (no match) for an unknown,
  expired, or already-used token. It must not throw for these cases.
- FR4: `consumeResetToken(token)` marks a valid token as used so it cannot be
  validated again, and returns the associated `userId`.
- FR5: Only one active (non-expired, unused) token may exist per user at a
  time; generating a new token invalidates any previous active token for
  that user.

## Non-Functional Requirements

- NFR1: Tokens must not be predictable or guessable (cryptographically
  random, sufficient length).
- NFR2: No sensitive data (raw tokens, user PII) may be written to logs.
- NFR3: Token storage should be swappable (start with an in-memory store
  behind an interface, so a persistent store can be substituted later).

## Out of Scope

- Sending the reset email/notification itself
- Rate limiting reset requests per user or IP

## Acceptance Criteria

- All functional requirements above have at least one passing test.
- A token cannot be validated or consumed twice.
- A token cannot be validated after its expiry has passed.
- Generating a second token for the same user invalidates the first.
