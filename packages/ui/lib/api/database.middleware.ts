import { SessionEndpointHandler, SimpleEndpointHandler } from "./endpoint-typings";
import { storageInitialize$ } from "../storage";

/** API wrapper that collects the session information, if it exists. */
export function withDatabase(next$: SimpleEndpointHandler): SimpleEndpointHandler;
export function withDatabase(next$: SessionEndpointHandler): SessionEndpointHandler;
export function withDatabase(next$: SessionEndpointHandler): SessionEndpointHandler {
  return async (req, res, sessionData) => {
    try {
      await storageInitialize$;
    } catch (e) {
      return res.status(500).json({"error": { "code": "storage/unknown" }});
    }

    await next$(req, res, sessionData);
  }
}