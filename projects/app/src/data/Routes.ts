// Define an enum for HTTP methods
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Define the Endpoint interface
interface Endpoint {
  url: string
  method: HttpMethod
}

// Define the EndpointGroup interface
interface EndpointGroup {
  prefix: string
  endpoints: Record<string, Endpoint>
}

const Ports = {
  Debug: 7287,
  Development: 5036,
}

// Define the AuthEndpoints constant
export const AuthEndpoints = {
  prefix: `http://localhost:${Ports.Development}/api/auth`,
  endpoints: {
    Login: {
      url: "/login",
      method: HttpMethod.POST,
    },
    Logout: {
      url: "/logout",
      method: HttpMethod.GET,
    },
    Verify: {
      url: "/verify",
      method: HttpMethod.GET,
    },
    VerifySetup: {
      url: "/verifyHasSetup",
      method: HttpMethod.GET,
    },
    Setup: {
      url: "/setup",
      method: HttpMethod.POST,
    },
    SrpStart: {
      url: "/start",
      method: HttpMethod.POST,
    },
    SrpComplete: {
      url: "/complete",
      method: HttpMethod.POST,
    },
  },
} satisfies EndpointGroup
