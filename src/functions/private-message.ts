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
  const assets = Runtime.getAssets();
  // After compiling the assets, the result will be "message.js" not a TypeScript file.
  const message = require(assets["/message.js"].path);
  const twiml = new Twilio.twiml.MessagingResponse();
  twiml.message(message.privateMessage());
  callback(null, twiml);
};
