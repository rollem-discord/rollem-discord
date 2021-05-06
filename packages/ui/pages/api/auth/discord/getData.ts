import DiscordOauth2 from "discord-oauth2";
import { withSession } from "next-session";
import util from "util";

import { storage, storageInitialize$ } from "@rollem/ui/lib/storage";

import { NextApiRequest, NextApiResponse } from "next";
import {
  RollemApiRequest,
  RollemSessionData,
} from "@rollem/ui/lib/withSession";

export default withSession(
  async (req: RollemApiRequest<RollemSessionData>, res: NextApiResponse) => {
    try {
      // console.log(util.inspect(req.session, true, null, true));

      res
        .status(200)
        .json(req.session);
    } catch (ex) {
      console.error(ex);
      res.status(500);
    }
  }
);
