export class AuthTokenError extends Error {
  constructor() {
    super('Something wrong with authentication.');
  }
}
