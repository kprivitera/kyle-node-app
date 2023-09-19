import { SignJWT, jwtVerify, generateKeyPair, type JWTPayload } from "jose";
import util from "util";

type ExtendedJWTPayload<T> = JWTPayload & {
  data: T;
};

const alg = "HS256";

export async function sign<T>(
  payload: ExtendedJWTPayload<T>,
  secret: string,
  expiry: string
): Promise<any> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime(expiry)
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
  const extendedPayload = payload as ExtendedJWTPayload<T>;
  // run some checks on the returned payload, perhaps you expect some specific values

  // if its all good, return it, or perhaps just return a boolean
  return extendedPayload;
}
