import { ErrorAlert } from './Error';

const FlexpaErrorMap = {
  // from flexpa docs
  AUTHORIZATION_CODE_EXCHANGE: `The payer's endpoint returned an error after authorization when exchanging an authorization code for an access token.`,
  INVALID_REQUEST: `The callback from payer's endpoint was not properly formatted.`,
  INVALID_STATE: `The payer's endpoint returned an invalid state parameter.`,
  PATIENT_INIT: `Flexpa was unable to synchronize the data successfully to the cache after authorization.`,
  QUERY_REJECTED: `The payer's endpoint did not grant access to the patient. This may occur if the patient clicks "do not consent" on some payer consent screens but can also occur for other reasons.`,
  QUERY_TIMEOUT: `The payer's endpoint timed out before it could fulfill the request.`,
  QUERY_INELIGIBLE: `The payer has not made the selected plan accessible via their API. This may occur if the payer does not support API access for certain plan types.`,
  QUERY_UNKNOWN: `The payer's endpoint did not understand the request.`,
  QUERY_SERVER_ERROR: `The payer's endpoint experienced an internal server error.`,
  QUERY_INVALID_CONFIG: `The payer's endpoint configuration needs to be updated by a Flexpa admin.`,
  QUERY_INVALID_SCOPE: `The payer's scope configuration needs to be updated by a Flexpa admin.`,
  // Me
  UNKNOWN_ERROR: `An unknown error has occurred.`,
  ACCESS_TOKEN_REQUEST_FAILED: `The application request for an access token has failed.`,
} as const;

export type FlexpaCodedError = {
  code: keyof typeof FlexpaErrorMap;
};

export function FlexpaErrorAlert({ error }: { error: FlexpaCodedError }) {
  return <ErrorAlert errorMessage={FlexpaErrorMap[error.code]} />;
}
