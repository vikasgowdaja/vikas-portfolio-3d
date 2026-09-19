# Engineering Coding Standards

## 1) General Principles
All development should prioritize:

- Readability
- Maintainability
- Reusability
- Testability
- Separation of concerns
- Consistent project conventions
- Minimal duplication
- Clear and meaningful naming
- Predictable behavior
- Backward compatibility where applicable

Code should be written for long-term maintenance rather than only for immediate functionality.

## 2) File and Component Size
### 500-Line Guideline
No individual source file, component, service, controller, utility, hook, model, or similar implementation should exceed 500 lines of code.

### Preferred Approach
When a file approaches 500 lines:

1. Identify independent responsibilities.
2. Extract reusable logic into separate modules.
3. Split large UI components into smaller components.
4. Extract business logic into services or use-cases.
5. Extract validation into dedicated validation modules.
6. Extract database operations into repositories or data-access modules where appropriate.
7. Extract constants, types, interfaces, and configuration into dedicated files.
8. Extract reusable hooks and utilities when applicable.

### Exception
Exceeding 500 lines is permitted only when splitting the file would materially reduce clarity, introduce unnecessary abstraction, create excessive coupling, or otherwise make the implementation harder to maintain.

When exceeding the limit is unavoidable:

- Keep the implementation logically cohesive.
- Do not split code merely to satisfy line count.
- Prefer clear internal sections and well-defined responsibilities.
- Document the reason when the file becomes significantly larger than 500 lines.

500 lines is a maintainability guideline, not a reason to create artificial abstractions.

## 3) SOLID Principles
Follow SOLID principles wherever they improve maintainability and design quality.

### Single Responsibility Principle
A class, module, component, or function should have one clear responsibility.

Avoid:
- Components containing extensive business logic
- Controllers containing database logic
- Services handling unrelated responsibilities
- Utility modules becoming collections of unrelated functions

Prefer backend flow:
Controller -> Service or Use Case -> Repository or Data Access -> Database

Prefer frontend flow:
Page -> Feature Component -> Reusable Component -> Hook or Service -> API

### Open/Closed Principle
Code should generally be open for extension and closed for unnecessary modification.
Prefer extensible designs where new behavior can be introduced without repeatedly modifying large existing blocks of logic.
Avoid unnecessarily large if/else or switch structures when a cleaner strategy, mapping, or polymorphic design is appropriate.

### Liskov Substitution Principle
Implementations should remain substitutable for their abstractions.
Do not create inheritance structures where subclasses violate expected behavior of parent classes or interfaces.

### Interface Segregation Principle
Prefer small, focused interfaces and contracts.
Avoid forcing implementations to depend on methods or properties they do not use.

### Dependency Inversion Principle
High-level business logic should not be tightly coupled to low-level implementation details.
Prefer dependency injection and abstractions where appropriate.

## 4) Database ACID Principles
Preserve ACID properties wherever transactional behavior is required.

### Atomicity
A transaction should either complete successfully as a whole or roll back completely.
Avoid partially applied operations when multiple related database changes must succeed together.

### Consistency
Database operations must preserve constraints, required relationships, and application-level business rules.
Do not rely exclusively on frontend validation for data integrity.
Critical integrity rules should also be enforced at backend or database level.

### Isolation
Concurrent transactions should not produce invalid or unexpected intermediate states.
Use appropriate transaction isolation and locking where required.

### Durability
Once committed, persistence should be reliable per database guarantees.
Do not report success before required persistence has completed.

## 5) Database Design Standards
Prefer:
- Proper primary keys
- Appropriate foreign keys
- Meaningful indexes
- Unique constraints where required
- Appropriate data types
- Normalized schemas where appropriate
- Transactions for multi-step atomic operations
- Parameterized queries
- Database-level constraints for critical integrity rules

Avoid:
- Unnecessary duplicated data
- Unbounded queries
- SELECT * when specific fields are enough
- N+1 queries
- Unnecessary database round trips
- Business-critical integrity rules implemented only on frontend

## 6) API and Backend Standards
Backend APIs should:
- Validate incoming data
- Authenticate and authorize requests appropriately
- Return consistent response structures
- Use appropriate HTTP status codes
- Handle errors explicitly
- Avoid exposing sensitive information
- Prevent SQL or NoSQL injection
- Implement pagination for potentially large datasets
- Avoid unnecessary database calls

Prefer flow:
Request -> Validation -> Authentication or Authorization -> Controller -> Service -> Repository -> Database

Keep controllers thin; place business logic in services or use-cases.

## 7) Frontend Standards
Frontend components should remain focused and composable.

Avoid:
- Extremely large components
- Excessive prop drilling
- Business logic embedded directly in JSX
- Duplicate API logic
- Repeated validation logic
- Unnecessary state
- Excessive side effects

Prefer flow:
UI Component -> Custom Hook -> Service or API Client -> Backend

Reusable UI behavior should be extracted into reusable components or hooks.

## 8) Function and Method Standards
Functions should:
- Have one clear purpose
- Be reasonably small
- Use descriptive names
- Avoid excessive parameters
- Avoid hidden side effects
- Handle errors appropriately

Avoid vague names such as processEverything, handleData, doOperation.
Prefer explicit names that describe actual behavior.

## 9) Naming Standards
Use descriptive and consistent names.

- Variables: studentProfile, assessmentResult, accessToken
- Functions: fetchStudentProfile, validateSubmission, calculateScore
- Classes: StudentService, AssessmentRepository, UserController
- Constants: MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE, REQUEST_TIMEOUT_MS

Avoid unexplained abbreviations unless they are established domain terminology.

## 10) Error Handling
Handle errors deliberately.
Do not silently swallow errors.
Provide enough context for debugging while avoiding sensitive data exposure.
Prefer centralized error handling where appropriate.

## 11) Validation
Validate at appropriate boundaries.
Typical flow:
Frontend Validation -> API Validation -> Business Validation -> Database Constraints

Never rely exclusively on client-side validation for security or integrity.

## 12) Security
Follow secure coding practices:
- Never hardcode secrets
- Never commit credentials
- Use environment variables or secrets management
- Validate and sanitize external input
- Use parameterized queries
- Apply authentication and authorization
- Follow least-privilege principles
- Avoid exposing stack traces or internal details
- Do not log sensitive values

## 13) Code Duplication
Avoid unnecessary duplication.
If the same logic appears repeatedly, evaluate whether it is the same business rule and extract reusable implementation when appropriate.
Do not create abstractions solely to remove a few repeated lines if it hurts readability.

## 14) Comments and Documentation
Prefer self-explanatory code.
Comments should explain why decisions exist, business rules, constraints, workarounds, or architecture decisions.
Avoid comments that only repeat code behavior.

## 15) Testing Standards
New functionality should include appropriate tests.
Prioritize testing of:
- Business logic
- Critical workflows
- API contracts
- Validation
- Error handling
- Database transactions
- Authorization
- Regression-prone paths

Tests should be deterministic and isolated.

## 16) Performance
Optimize based on measurable or identifiable bottlenecks.
Watch for unnecessary API requests, duplicate queries, N+1 patterns, large payloads, unnecessary re-renders, missing indexes, expensive computations, and unnecessary network calls.
Do not sacrifice maintainability for premature optimization.

## 17) Configuration and Environment Management
Environment-specific configuration must not be hardcoded.
Use environment variables or configuration mechanisms for URLs, credentials, secrets, API keys, and environment-specific settings.
Never commit production secrets.

## 18) Git and Change Management
Commits should be focused, descriptive, and scoped to a logical change.
Avoid mixing unrelated changes in one commit.

## 19) Architecture and Separation of Concerns
Maintain clear boundaries:
Presentation -> Application or Use Cases -> Domain or Business Logic -> Infrastructure or Data Access

Use the simplest architecture that provides maintainability, testability, and scalability.
Do not introduce patterns for their own sake.

## 20) Refactoring Rule
When modifying existing code:
- Avoid unnecessary rewrites.
- Preserve existing behavior unless requirements explicitly change.
- Improve structure incrementally when directly related to requested change.
- Avoid introducing unrelated technical debt.
- Do not perform broad refactors without clear reason.

## 21) Final Code Review Checklist
Before considering a change complete, verify:

- No unnecessary file exceeds 500 lines.
- Any file over 500 lines has a documented technical reason.
- Responsibilities are appropriately separated.
- SOLID principles are followed where applicable.
- Database operations preserve required ACID behavior.
- Database constraints protect integrity rules.
- API input is validated.
- Authentication and authorization are correctly applied.
- Errors are handled explicitly.
- No secrets or credentials are committed.
- No unnecessary duplication exists.
- Naming is clear and consistent.
- Functions and components have focused responsibilities.
- Critical functionality has appropriate tests.
- Performance implications are considered.
- Changes are limited to required scope.
- Existing functionality is not unintentionally broken.

## Core Rule
Prefer simple, cohesive, maintainable code over artificially small files or unnecessarily complex abstractions.
The 500-line limit is a strong guideline, while correctness, maintainability, SOLID design, data integrity, security, and clarity take precedence when they conflict.
