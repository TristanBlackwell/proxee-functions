import { ServerlessFunctionSignature } from "@twilio-labs/serverless-runtime-types/types";
import { BaseContext } from "../types";

interface Event {
  Digits: string;
}

export const handler: ServerlessFunctionSignature<BaseContext, Event> = (
  context,
  event,
  callback
) => {
  const proxyPhoneNumber = context.PROXY_PHONE_NUMBER;
  if (!proxyPhoneNumber) {
    return callback("No proxy number has been set for Proxee.");
  }

  const phoneNumberToCall = event.Digits;

  const twiml = new Twilio.twiml.VoiceResponse();

  twiml.say(`Starting call to ${phoneNumberToCall.split("").join(" ")}`);

  // callerId required to make the phone call "originate" from proxyPhoneNumber
  twiml.dial({ callerId: proxyPhoneNumber }, phoneNumberToCall);

  return callback(null, twiml);
};
