# Crypto Service

## Notes

### Approach

- Identify areas of complexity
  - Calculating standard deviations is expensive. Should we do it at write-time, read-time, or asynchronously?
- Create skeleton app
  - API connection
  - Database connection
  - Tests
  - Efficient development process

### Assumptions

- We want the prices for every coin, despite multiple coins having the same symbol.
- API tests are to validate that our assumptions about the API are still valid, therefore we don't use mocks. Real requests are sent and real responses are verified.

### Todo's

- DB migrations
- Initialization
  - With only a single entry for each pair, we get no results, so tests fail the first time.
- Maybe clear existing data when sync job starts?
  - Unless having a gap in the data is ok.

### Concerns

- Requesting prices for all coins and all currencies every minute.

  - URI too long
  - Seems like a lot of data transfer
  - Rate limiting?

- What happens if coins or currencies get removed and we're still requesting their prices?

- Putting the API Key in the repo

  - Would usually use a secret, loaded at runtime

- Once the 24-hour time-window is full, there will be a moment during sync where there will be an extra 

  