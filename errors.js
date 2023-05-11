export class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.status = 404;
    }
  }
  export class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
      this.status = 400;
    }
  }
  export class UnauthorizedError extends Error {
    constructor(message) {
      super(message);
      this.name = 'UnauthorizedError';
      this.status = 401;
    }
  }
  export class MethodNotAllowedError extends Error {
    constructor(message = "Method Not Allowed") {
      super(message);
      this.name='NotAllowedError';
      this.status = 405;
    }
  }
  