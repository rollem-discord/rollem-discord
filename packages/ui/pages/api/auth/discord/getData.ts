import DiscordOauth2 from "discord-oauth2";
import util from "util";

import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";

import { NextApiRequest, NextApiResponse } from "next";
import {
  RollemApiRequest,
  RollemSessionData,
} from "@rollem/ui/lib/api/old.withSession";
import { apiHandleErrors } from "@rollem/ui/lib/api/errors.middleware";
import { withSession, withSessionRequired } from "@rollem/ui/lib/api/session.middleware";
import { Session } from "next-session/lib/types";

export default 
  apiHandleErrors(withSession(withSessionRequired(
  async (req: NextApiRequest, res: NextApiResponse, session: Session<RollemSessionData>) => {
    res
      .status(200)
      .json(session);
  })));
