import { VerificationService } from "../../src/services/verification.service";

/**
 * Background job to check and deactivate expired promotions
 */
export async function runCheckExpiredPromotionsJob() {
  console.log(`[Worker Job] Running check-expired-promotions at ${new Date().toISOString()}`);
  try {
    const result = await VerificationService.checkAndDeactivateExpired();
    console.log(`[Worker Job] Deactivated ${result.countDeactivated} expired promotions.`);
    return result;
  } catch (error) {
    console.error("[Worker Job Error] Failed to deactivate expired promotions:", error);
    throw error;
  }
}

