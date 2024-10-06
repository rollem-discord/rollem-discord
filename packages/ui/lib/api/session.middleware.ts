import nextSession from "next-session";
import { RollemSessionData } from "./old.withSession";
import { SessionEndpointHandler, SimpleEndpointHandler } from "./endpoint-typings";
import { Session } from "next-session/lib/types";
const getSession = nextSession<RollemSessionData>();

/** API wrapper that collects the session information, if it exists. */
export function withSession(next$: SessionEndpointHandler): SimpleEndpointHandler {
  return async (req, res) => {
    let sessionData: Session<RollemSessionData> = undefined;
    try {
      sessionData = await getSession(req, res);
    } catch (e) {
      return res.status(500).json({"error": { "code": "auth/unknown" }});
    }

    await next$(req, res, sessionData);
  }
}

/** API wrapper that demands the user be authenticated. */
export function withSessionRequired(next$: SessionEndpointHandler): SessionEndpointHandler {
  return async (req, res, sessionData) => {
    if (!sessionData) {
      return res.status(401).json({"error": { "code": "auth/missing" }});
    }

    await next$(req, res, sessionData);
  }
}