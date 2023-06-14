import { ServerlessFunctionSignature } from "@twilio-labs/serverless-runtime-types/types";
import { BaseContext } from "../types";

interface Event {
  Body: string;
  From: string;
}

export const handler: ServerlessFunctionSignature<BaseContext, Event> = (
  context,
  event,
  callback
) => {
  const client = context.getTwilioClient();
  const proxyPhoneNumber = context.PROXY_PHONE_NUMBER;
  const privatePhoneNumber = context.PRIVATE_PHONE_NUMBER;

  if (!privatePhoneNumber) {
    return callback("No private number has been set for Proxee.");
  }
  if (!proxyPhoneNumber) {
    return callback("No proxy number has been set for Proxee.");
  }

  const twiml = new Twilio.twiml.MessagingResponse();

  const body = event.Body;

  if (event.From === privatePhoneNumber) {
    console.log("Message received from private number.");
    if (!body.toLowerCase().startsWith("to ")) {
      console.log("Incorrect formatting, informing user.");
      twiml.message(
        'Please start your text with "To [phone-number]:" followed by your message'
      );
      return callback(null, twiml);
    }

    // example body: to +1123-456-7890: Hi
    const targetPhoneNumber = body.substring(3, body.indexOf(":"));
    const targetMessage = body.substring(body.indexOf(":") + 1).trim();

    console.log(
      `Sending message '${targetMessage}' from ${proxyPhoneNumber} to ${targetPhoneNumber}.`
    );

    client.messages
      .create({
        body: targetMessage,
        from: proxyPhoneNumber,
        to: targetPhoneNumber,
      })
      .then(() => {
        console.log("Message sent.");
        twiml.message("Message sent");
        return callback(null, twiml);
      })
      .catch((error) => {
        console.error(`Error dispatching message: ${error}`);
        twiml.message(
          "An error occurred sending your message. Check the Twilio Console for more details."
        );
        return callback(error, twiml);
      });
  } else {
    console.log(`Received message from ${event.From}: ${event.Body}.`);
    client.messages
      .create({
        body: `SMS from: ${event.From}, Body: ${event.Body}`,
        from: proxyPhoneNumber,
        to: privatePhoneNumber,
      })
      .then(() => {
        console.log(`Message forwarded to ${privatePhoneNumber}.`);
        return callback(null);
      })
      .catch((error) => {
        console.error(
          `Error forwarding message onto ${privatePhoneNumber}: ${error}`
        );
        return callback(error);
      });
  }

  return callback(null);
};
