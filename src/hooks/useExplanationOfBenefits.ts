import { useCallback, useEffect, useState } from 'react';
import { FlexpaAuth } from './useFlexpa';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { isError } from 'lodash';

export function useExplanationOfBenefits(flexpaAuth: FlexpaAuth) {
  const [eobs, setEOBs] = useState<R4.IExplanationOfBenefit[]>([]);
  const [status, setStatus] = useState<
    'loading' | { errorMessage: string } | 'complete'
  >('loading');

  useEffect(() => {
    (async () => {
      setStatus('loading');
      try {
        const response = await fetch(
          `/api/fhir/ExplanationOfBenefit?patient=$PATIENT_ID`,
          {
            headers: {
              authorization: `Bearer ${flexpaAuth.access_token}`,
              'content-type': 'application/json',
              'x-flexpa-raw': '0',
            },
          },
        );
        if (response.status !== 200) {
          throw new Error('Request for explanation of benefits has failed');
        }
        const jsonBody = await response.json();

        // this library uses io-ts. Cool, but not exactly friendly. Eject.
        const parsedResult = R4.RTTI_Bundle.decode(jsonBody);
        if (parsedResult._tag === 'Left') {
          throw new Error('API returned invalid FHIR bundle');
        }
        const bundle = parsedResult.right;

        // for every entry in the bundle, filter out all non-eobs and grab only the resource.
        const eobs = (bundle.entry ?? []).flatMap((entry) => {
          if (entry.resource?.resourceType === 'ExplanationOfBenefit') {
            return entry.resource;
          } else {
            return [];
          }
        });
        setEOBs(eobs);
        setStatus('complete');
      } catch (e) {
        const errorMessage = isError(e)
          ? e.message
          : 'An unexpected error has occurred.';
        setStatus({ errorMessage });
        setEOBs([]);
      }
    })();
  }, [flexpaAuth]);

  return { eobs, status };
}
