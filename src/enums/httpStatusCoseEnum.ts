export enum HttpStatusEnum {
    CONTINUE = 100,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    INSUFFICIENT_STORAGE = 507,
  }
  
  export enum ReasonPhrasesEnum {
    ACCEPTED = "Accepted",
    BAD_REQUEST = "Bad Request",
    CONTINUE = "Continue",
    CREATED = "Created",
    METHOD_NOT_ALLOWED = "Method Not Allowed", 
    INTERNAL_SERVER_ERROR = "Internal Server Error",
    INSUFFICIENT_STORAGE = "Insufficient Storage",
    NOT_FOUND = "Not Found",
    OK = "OK",
    SERVICE_UNAVAILABLE = "Service Unavailable",
    TOO_MANY_REQUESTS = "Too Many Requests",
    UNAUTHORIZED = "Unauthorized",
  }
  