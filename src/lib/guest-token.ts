export function getGuestToken() {
  const existing = localStorage.getItem("soul_guest_token");
  if (existing) return existing;

  const next = crypto.randomUUID();
  localStorage.setItem("soul_guest_token", next);
  return next;
}
