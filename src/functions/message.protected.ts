import { ServerlessFunctionSignature } from "@twilio-labs/serverless-runtime-types/types";
import { BaseContext } from "../types";

interface Event {
  Body: string;
  From: string;
}

export const handler: ServerlessFunctionSignature<BaseContext, Event> = async (
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

    try {
      const message = await client.messages.create({
        body: targetMessage,
        from: proxyPhoneNumber,
        to: targetPhoneNumber,
      });

      console.log(`Message sent with SID: ${message.sid}.`);
      twiml.message("Message sent");
      return callback(null, twiml);
    } catch (error) {
      console.error(`Error dispatching message: ${error}`);
      twiml.message(
        "An error occurred sending your message. Check the Twilio Console for more details."
      );
      if (error instanceof Error) {
        return callback(error, twiml);
      }
      return callback(null, twiml);
    }
  } else {
    console.log(`Received message from ${event.From}: ${event.Body}.`);
    try {
      const message = await client.messages.create({
        body: `SMS from: ${event.From}, Body: ${event.Body}`,
        from: proxyPhoneNumber,
        to: privatePhoneNumber,
      });

      console.log(
        `Message forwarded to ${privatePhoneNumber} with SID ${message.sid}.`
      );
      return callback(null);
    } catch (error) {
      console.error(
        `Error forwarding message onto ${privatePhoneNumber}: ${error}`
      );
      if (error instanceof Error) {
        return callback(error);
      }

      return callback(null);
    }
  }
};
