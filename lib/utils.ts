export function formatRupees(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `CJ-${timestamp}-${random}`;
}
