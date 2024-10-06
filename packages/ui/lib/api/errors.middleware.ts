import { SimpleEndpointHandler } from "./endpoint-typings";

/** API wrapper that eats any errors that may occur. They are not logged. */
export function apiHandleErrors(next$: SimpleEndpointHandler): SimpleEndpointHandler {
  return async (req, res) => {
    try {
      await next$(req, res);
    } catch (e) {
      return res.status(500).json({"error": { "code": "unknown" }});
    }
  }
}
