import { NextApiRequest, NextApiResponse } from "next";

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
export async function expressMiddlewareToPromiseForApi<TReq extends NextApiRequest, TRes extends NextApiResponse>(
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
export function expressToNextApiMiddleware<
  TReq extends NextApiRequest,
  TRes extends NextApiResponse
>(
  middleware: ExpressMiddlewareWithCallback<TReq, TRes>
): (req: TReq, res: TRes) => Promise<void> {
  return (req, res) =>
    expressMiddlewareToPromiseForApi(req, res, middleware);
}
