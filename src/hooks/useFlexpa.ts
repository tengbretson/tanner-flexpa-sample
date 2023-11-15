import { useEffect, useState } from 'react';
import { FlexpaCodedError } from '../components/FlexpaError';
import { jwtDecode } from 'jwt-decode';
import '@/vendor/flexpa.v1';

type FlexpaLinkCreateOptions = {
  publishableKey: string;
  onSuccess: (token: string) => void;
  onExit: (error?: FlexpaCodedError) => void;
};

type FlexpaLink = {
  create(options: FlexpaLinkCreateOptions): void;
  open(): void;
};

type FlexpaJWT = {
  jti: string;
  iat: number;
  exp: number;
  sub: string;
};

export type FlexpaAuth = {
  access_token: string;
  patientId: string;
  expires: Date;
};

// this doesn't require some global declaration, since all access will be
// gated from here on out through this hook.
declare const FlexpaLink: FlexpaLink;

export function useFlexpa() {
  const [error, setErrorState] = useState<FlexpaCodedError>();
  const [flexpaAuth, setFlexpaAuth] = useState<FlexpaAuth>();
  const [publicToken, setPublicToken] = useState<string>();
  const publishableKey =
    process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY ?? 'invalid-key';

  useEffect(() => {
    FlexpaLink.create({
      publishableKey,
      onSuccess: async (public_token) => {
        setPublicToken(public_token);
        const headers = new Headers([['content-type', 'application/json']]);
        const body = JSON.stringify({ public_token });
        try {
          const response = await fetch(
            new URL('/api/access-token', window.location.origin),
            { method: 'POST', headers, body },
          );
          if (response.status !== 200) {
            return setErrorState({ code: 'ACCESS_TOKEN_REQUEST_FAILED' });
          }
          const json = await response.json();
          // validate();
          setAuth(json.access_token);
          setErrorState(undefined);
        } catch (error) {
          console.log(error);
          setErrorState({ code: 'UNKNOWN_ERROR' });
        }
      },
      onExit: (error) => {
        setErrorState(error);
      },
    });
  }, [publishableKey]);

  // It is more accurate to derrive the expiry from the decoded token.
  function setAuth(access_token: string) {
    // convert to time in the future.
    const decoded = jwtDecode<FlexpaJWT>(access_token);
    const expires = new Date(decoded.exp * 1000);
    const patientId = decoded.sub.replace('Patient/', '');
    setFlexpaAuth({ access_token, patientId, expires });
  }

  function openPortal() {
    FlexpaLink.open();
  }

  return {
    error,
    flexpaAuth,
    openPortal,
  };
}
