// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

interface Event {}

export const handler: ServerlessFunctionSignature = (
  context: Context,
  event: Event,
  callback: ServerlessCallback
) => {
  const twiml = new Twilio.twiml.MessagingResponse();
  twiml.message("Hello World!");
  callback(null, twiml);
};
