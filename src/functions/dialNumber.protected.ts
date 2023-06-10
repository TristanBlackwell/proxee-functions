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
  const twiml = new Twilio.twiml.VoiceResponse();

  const proxyPhoneNumber = context.PROXY_PHONE_NUMBER;
  if (!proxyPhoneNumber) {
    twiml.say(
      "Your proxy number has not yet been configured. Please set this up to continue."
    );
    return callback(null, twiml);
  }

  const phoneNumberToCall = event.Digits;

  twiml.say(`Starting call to ${phoneNumberToCall.split("").join(" ")}`);

  // callerId required to make the phone call "originate" from proxyPhoneNumber
  twiml.dial({ callerId: proxyPhoneNumber }, phoneNumberToCall);

  return callback(null, twiml);
};
