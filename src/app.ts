import cron from "node-cron";
import {
  SIGNER_UUID,
  TIME_ZONE,
  NEYNAR_API_KEY,
} from "./config.js";
import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk";

console.log('Starting up: ', Date.now());

const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

// Validating necessary environment variables or configurations.
if (!SIGNER_UUID) {
  throw new Error("SIGNER_UUID is not defined");
}

if (!NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not defined");
}

/**
 * Function to publish a message (cast) using neynarClient.
 * @param msg - The message to be published.
 */
const publishCast = async (msg: string) => {
  try {
    // Using the neynarClient to publish the cast.
    await neynarClient.publishCast(SIGNER_UUID, msg, { channelId:"southcastle" });
    console.log("Cast published successfully");
  } catch (err) {
    // Error handling, checking if it's an API response error.
    if (isApiErrorResponse(err)) {
      console.log(err.response.data);
    } else console.log(err);
  }
};

const MESSAGE = "Summoning team SOUTH to !attack north in /farcastles"

const job = cron.schedule(
  `0 */12 * * *`, // Cron time format
  function () {
    publishCast(MESSAGE); // Function to execute at the scheduled time.
  },
  {
    scheduled: true, // Ensure the job is scheduled.
    timezone: TIME_ZONE, // Set the timezone for the schedule.
  }
);


// Logging to inform that the cron job is scheduled.
console.log(
  `Scheduled reminders since ${Date.now()}, please don't restart your system or use a permanent solution to store cronjobs and retrieve on restart.`
);
