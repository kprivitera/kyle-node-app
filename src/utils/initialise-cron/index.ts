import cron from "cron";

const initialiseCron = () => {
  const job = new cron.CronJob("* * * * *", () => {
    console.log("This message will be logged every day at midnight");
  });

  // Start the cron job
  job.start();
};

export default initialiseCron;
