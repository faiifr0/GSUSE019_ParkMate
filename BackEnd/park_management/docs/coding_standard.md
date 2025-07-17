## Service Method Naming Convention

- `findX`: may return `null` or `Optional<T>`. Caller must handle absence.
- `getX`: must return non-null. Throws exception if not found.

### Examples:
- `findCustomerById(Long id)` → returns `null` if not found
- `getCustomerById(Long id)` → throws `CustomerNotFoundException`
