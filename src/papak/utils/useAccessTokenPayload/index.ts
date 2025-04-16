"use client";

import { useEffect, useState } from "react";
import { decode } from "jsonwebtoken";
import Cookies from "universal-cookie";

export function useAccessTokenPayload<T>(token: string): T {
  const [accessToken, setAccessToken] = useState<T>(null as T);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookieStore = new Cookies(null, { path: "/" });
      const access_token = cookieStore.get(token);
      setAccessToken(access_token ? (decode(access_token) as T) : ({} as T));
    }
  }, [token]);

  return accessToken;
}
