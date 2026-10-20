import { runCheckExpiredPromotionsJob } from "./jobs/check-expired.job";

/**
 * PromoRadar Standalone Background Worker
 * Runs scheduled verification, ingestion, and cleanups
 */
async function startWorker() {
  console.log("🚀 PromoRadar Background Worker starting...");

  // Run initial check on startup
  try {
    await runCheckExpiredPromotionsJob();
  } catch (err) {
    console.error("Initial check error:", err);
  }

  // Schedule periodic run every hour (3,600,000 ms)
  const INTERVAL_MS = 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await runCheckExpiredPromotionsJob();
    } catch (err) {
      console.error("Scheduled check error:", err);
    }
  }, INTERVAL_MS);

  console.log("🕒 Worker scheduled hourly expired promo checks.");
}

// Start worker if run directly
if (require.main === module) {
  startWorker().catch((err) => {
    console.error("Fatal worker error:", err);
    process.exit(1);
  });
}

export { startWorker };

