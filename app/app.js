// DealHarbor entry point: wires the controls, routes, and rendering.
import { CHECKED_ON, DEALS } from "./deals.js";
import { filterDeals, sortDeals, uniqueValues } from "./filters.js";
import { cardHtml, detailHtml, statsHtml } from "./render.js";

const els = {
  q: document.getElementById("q"),
  category: document.getElementById("category"),
  store: document.getElementById("store"),
  minDiscount: document.getElementById("minDiscount"),
  verdict: document.getElementById("verdict"),
  sort: document.getElementById("sort"),
  grid: document.getElementById("grid"),
  detail: document.getElementById("detail"),
  resultLine: document.getElementById("resultLine"),
  stats: document.getElementById("stats")
};

function fillSelect(select, values, allLabel) {
  select.innerHTML = '<option value="">' + allLabel + "</option>" +
    values.map((v) => '<option value="' + v + '">' + v + "</option>").join("");
}

function readState() {
  return {
    q: els.q.value,
    category: els.category.value,
    store: els.store.value,
    minDiscount: Number(els.minDiscount.value),
    verdict: els.verdict.value,
    sort: els.sort.value
  };
}

function renderList() {
  const state = readState();
  const visible = sortDeals(filterDeals(DEALS, state), state.sort);
  els.detail.hidden = true;
  els.grid.hidden = false;
  els.resultLine.textContent = visible.length + " of " + DEALS.length + " deals shown, sorted by " +
    els.sort.options[els.sort.selectedIndex].text.toLowerCase() + ".";
  els.grid.innerHTML = visible.length
    ? visible.map((deal) => cardHtml(deal, CHECKED_ON)).join("")
    : '<p class="empty">No deals match those filters. Loosen the discount or clear the search.</p>';
}

function renderDetail(id) {
  const deal = DEALS.find((d) => d.id === id);
  if (!deal) {
    renderList();
    return;
  }
  els.grid.hidden = true;
  els.detail.hidden = false;
  els.resultLine.textContent = "Deal details";
  els.detail.innerHTML = detailHtml(deal, CHECKED_ON);
  window.scrollTo(0, 0);
}

function applyHashQuery() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) return;
  const query = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
  const params = new URLSearchParams(query);
  els.q.value = params.get("q") || "";
  els.category.value = params.get("cat") || "";
  els.store.value = params.get("store") || "";
  els.minDiscount.value = params.get("min") || "0";
  els.verdict.value = params.get("verdict") || "";
  els.sort.value = params.get("sort") || "score";
}

function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) renderDetail(hash.slice("#/deal/".length));
  else {
    applyHashQuery();
    renderList();
  }
}

fillSelect(els.category, uniqueValues(DEALS, "category"), "All categories");
fillSelect(els.store, uniqueValues(DEALS, "store"), "All stores");
els.stats.innerHTML = statsHtml(DEALS, CHECKED_ON);
applyHashQuery();
for (const el of [els.q, els.category, els.store, els.minDiscount, els.verdict, els.sort]) {
  el.addEventListener("input", renderList);
  el.addEventListener("change", renderList);
}
window.addEventListener("hashchange", route);
route();
