import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import util from "util";

type ExtendedJWTPayload<T> = JWTPayload & {
  data: T;
};

export async function sign<T>(
  payload: ExtendedJWTPayload<T>,
  secret: string,
  expiry: string
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  //   const exp = iat + 60 * 60; // one hour

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiry)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new util.TextEncoder().encode(secret));
}

export async function verify<T>(
  token: string,
  secret: string
): Promise<ExtendedJWTPayload<T>> {
  const { payload } = await jwtVerify(
    token,
    new util.TextEncoder().encode(secret)
  );
  console.log("payload", payload);
  const extendedPayload = payload as ExtendedJWTPayload<T>;
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return extendedPayload;
}
