import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { expressToNextApiMiddleware } from "./express-middleware-converter";

// TODO: CORS Pre-flight? https://github.com/expressjs/cors?tab=readme-ov-file#enabling-cors-pre-flight

// CORS example from here https://github.com/vercel/next.js/blob/fe797c1074f6b2639d89f601fba7f2ea8bbba629/examples/api-routes-cors/README.md
// Options: https://github.com/expressjs/cors#configuration-options
const standardCors = Cors({
  methods: ["POST", "GET", "HEAD", "DELETE", "PATCH", "PUT"],
  allowedHeaders: [
    "X-CSRF-Token",
    "X-Requested-With",
    "Accept",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Date",
    "X-Api-Version",
  ],
  credentials: true,
  origin: [
    'https://www.owlbear.rodeo',
  ],
});

/**
 * CORS API middleware based on `cors` ExpressJS Middleware.
 * Config is in this package.
 */
export const cors = expressToNextApiMiddleware(standardCors);
export default cors;