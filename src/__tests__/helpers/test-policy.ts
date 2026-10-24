import type { TreasuryPolicy } from "../../types.js";

// Política fija para pruebas (valores del repo original).
// Independiente de DEFAULT_TREASURY_POLICY, que usa topes de producción más estrictos.
export const TEST_POLICY: TreasuryPolicy = {
  maxSingleTransferCents: 5000,
  maxHourlyTransferCents: 10000,
  maxDailyTransferCents: 25000,
  minimumReserveCents: 1000,
  maxX402PaymentCents: 100,
  x402AllowedDomains: ['conway.tech'],
  transferCooldownMs: 0,
  maxTransfersPerTurn: 2,
  maxInferenceDailyCents: 50000,
  requireConfirmationAboveCents: 1000,
};
