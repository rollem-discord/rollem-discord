import { NextApiRequest, NextApiResponse } from "next";
import { RollemSessionData } from "./old.withSession";
import { Session } from "next-session/lib/types";

/** The simplest async endpoint. */
export type SimpleEndpointHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;


/** An async endpoint with attached session data. */
export type SessionEndpointHandler = (req: NextApiRequest, res: NextApiResponse, session?: Session<RollemSessionData>) => Promise<void>;
