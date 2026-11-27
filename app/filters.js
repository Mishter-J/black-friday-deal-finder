// Filtering, scoring, and sorting for the deal list.

export function discountPct(deal) {
  return Math.round((1 - deal.sale / deal.was) * 100);
}

const VERDICT_BONUS = {
  "New low": 25,
  "Strong price": 15,
  "Routine sale": 0,
  "Inflated list": -10
};

export function dealScore(deal) {
  const raw = discountPct(deal) + (VERDICT_BONUS[deal.verdict] ?? 0);
  return Math.max(0, Math.min(100, raw));
}

export function uniqueValues(deals, key) {
  return [...new Set(deals.map((d) => d[key]))].sort();
}

export function filterDeals(deals, state) {
  const q = state.q.trim().toLowerCase();
  return deals.filter((deal) => {
    if (q && !(deal.name + " " + deal.store + " " + deal.category).toLowerCase().includes(q)) return false;
    if (state.category && deal.category !== state.category) return false;
    if (state.store && deal.store !== state.store) return false;
    if (state.verdict && deal.verdict !== state.verdict) return false;
    if (discountPct(deal) < state.minDiscount) return false;
    return true;
  });
}

export function sortDeals(list, sortKey) {
  const byId = (a, b) => (a.id < b.id ? -1 : 1);
  const sorted = [...list];
  if (sortKey === "discount") sorted.sort((a, b) => discountPct(b) - discountPct(a) || byId(a, b));
  else if (sortKey === "priceAsc") sorted.sort((a, b) => a.sale - b.sale || byId(a, b));
  else if (sortKey === "priceDesc") sorted.sort((a, b) => b.sale - a.sale || byId(a, b));
  else sorted.sort((a, b) => dealScore(b) - dealScore(a) || byId(a, b));
  return sorted;
}
