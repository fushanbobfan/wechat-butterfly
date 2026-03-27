interface AuditEvent {
  event: string;
  jobId: string;
  reason: string;
  route: string;
  at: string;
}

export function logAuditEvent(event: Omit<AuditEvent, 'at'>): void {
  // Replace with your centralized sink (SIEM / data lake).
  console.error(
    JSON.stringify({
      ...event,
      at: new Date().toISOString(),
    }),
  );
}
