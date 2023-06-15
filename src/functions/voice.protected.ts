import { ServerlessFunctionSignature } from "@twilio-labs/serverless-runtime-types/types";
import { BaseContext } from "../types";

interface Event {
  From: string;
}

export const handler: ServerlessFunctionSignature<BaseContext, Event> = async (
  context,
  event,
  callback
) => {
  const privatePhoneNumber = context.PRIVATE_PHONE_NUMBER;

  if (!privatePhoneNumber) {
    return callback("No private number has been set for Proxee.");
  }

  const twiml = new Twilio.twiml.VoiceResponse();

  if (event.From === privatePhoneNumber) {
    const gather = twiml.gather({ action: "/dialNumber" });
    gather.say(
      "Welcome to your Twilio proxy phone number. Who would you like to call?"
    );

    // fallback message in case no response is given
    twiml.say("No input received. Goodbye!");
    return callback(null, twiml);
  }

  // forward call to the private phone number
  twiml.dial(privatePhoneNumber);
  return callback(null, twiml);
};
