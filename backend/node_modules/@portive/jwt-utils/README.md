# portive/jwt-utils

A set of simple utility functions for working with JSON Web Tokens.

Used, for example, to create auth tokens in `portive/auth` and in the Portive admin website.

Typically you wouldn't use this directly. Developers integrating with Portive should use:

- The library built specifically for the open source component
- @portive/client to talk directly to the Portive API
- @portive/auth to create Auth Tokens
