import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

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
 * Expected values:
 * - 'route' => acceptable
 * - 'router' => acceptable
 * - undefined => acceptable
 * - Error => error
 * - anything else => fallback error
 * 
 * Found here https://expressjs.com/en/guide/writing-middleware.html
 */
export type ExpressMiddlewareCallbackValues = Error | 'route' | 'router' | unknown;

export type ExpressMiddlewareWithCallback<TReq,TRes> = (
  req: TReq,
  res: TRes,
  next: (err: Error | 'route' | 'router' | unknown) => any) => void;

/**
 * Converts a typical chained call to a non-async Express middleware into a Promise-based call.
 * https://expressjs.com/en/guide/writing-middleware.html
 */
export async function callbackBaseExpressMiddlewareToPromise<TReq extends NextApiRequest, TRes extends NextApiResponse>(
  req: TReq,
  res: TRes,
  middleware: ExpressMiddlewareWithCallback<TReq, TRes>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    middleware(req, res,
      (result: ExpressMiddlewareCallbackValues) => {
        const acceptableResult = result === undefined || result === "route" || result === "router";

        if (acceptableResult) {
          return resolve();
        } else if (result instanceof Error) {
          reject(result);
        } else {
          reject(new Error(
            "Unexpected error in Express middleware",
            { cause: result }));
        }

        if (result instanceof Error) {
          return reject(result);
        }
      }
    )
  })
}

/**
 * Converts a callback-based Express middleware (`(req,res,next) => void`)
 * into an async middleware (`async (req,res) => void`).
 * 
 * ```ts
 * // prepare outside endpoint
 * const asyncCors = expressToNextMiddleware(cors());
 * 
 * // call within endpoint.
 * export async function endpoint(req: NextApiRequest, res: NextApiResponse) {
 *  await asyncCors();
 *  // ... rest of the method ...
 * }
 * ```
 */
export function expressToNextMiddleware<
  TReq extends NextApiRequest,
  TRes extends NextApiResponse
>(
  middleware: ExpressMiddlewareWithCallback<TReq, TRes>
): (req: TReq, res: TRes) => Promise<void> {
  return (req, res) =>
    callbackBaseExpressMiddlewareToPromise(req, res, middleware);
}

const asyncCors = expressToNextMiddleware(standardCors);

export async function middleware(req: NextApiRequest, res: NextApiResponse) {
  try {
    // await asyncCors(req, res);
  } catch (e) {
    throw "it broke";
    res.status(500).json({"error": { "code": "cors" }});
  }
}
