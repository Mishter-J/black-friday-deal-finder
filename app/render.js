// Rendering for deal cards, the detail view, and header stats.
import { dealScore, discountPct } from "./filters.js";

export function money(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function verdictClass(verdict) {
  return "v-" + verdict.toLowerCase().replace(/\s+/g, "-");
}

export function statsHtml(deals, checkedOn) {
  const stores = new Set(deals.map((d) => d.store)).size;
  const lows = deals.filter((d) => d.verdict === "New low").length;
  const avg = Math.round(deals.reduce((sum, d) => sum + discountPct(d), 0) / deals.length);
  return [
    "<li><strong>" + deals.length + "</strong> checked deals</li>",
    "<li><strong>" + stores + "</strong> stores</li>",
    "<li><strong>" + lows + "</strong> new lows</li>",
    "<li>Average discount <strong>" + avg + "%</strong></li>",
    "<li>Prices checked <strong>" + checkedOn + "</strong></li>"
  ].join("");
}

export function cardHtml(deal, checkedOn) {
  const pct = discountPct(deal);
  return [
    '<article class="card">',
    '<div class="card-top"><span class="chip">' + deal.category + '</span>',
    '<span class="verdict ' + verdictClass(deal.verdict) + '">' + deal.verdict + "</span></div>",
    "<h3>" + deal.name + "</h3>",
    '<p class="store-line">at ' + deal.store + " &middot; " + deal.window + "</p>",
    '<div class="price-row"><span class="sale">' + money(deal.sale) + '</span>',
    '<span class="was">' + money(deal.was) + '</span>',
    '<span class="off">-' + pct + "%</span></div>",
    '<p class="score">Deal score ' + dealScore(deal) + "/100 &middot; You save " + money(deal.was - deal.sale) + "</p>",
    '<p class="evidence">' + deal.evidence + "</p>",
    '<p class="checked">Checked ' + checkedOn + " &middot; Source: " + deal.source + "</p>",
    '<div class="card-actions">',
    '<a class="btn btn-store" href="' + deal.url + '" target="_blank" rel="noopener">View at ' + deal.store + "</a>",
    '<a class="btn btn-detail" href="#/deal/' + deal.id + '">Details</a>',
    "</div></article>"
  ].join("");
}

export function detailHtml(deal, checkedOn) {
  const pct = discountPct(deal);
  return [
    '<a class="back" href="#/">&larr; Back to all deals</a>',
    '<div class="card-top" style="margin-top:14px"><span class="chip">' + deal.category + '</span>',
    '<span class="verdict ' + verdictClass(deal.verdict) + '">' + deal.verdict + "</span></div>",
    "<h2>" + deal.name + "</h2>",
    '<p class="math">' + money(deal.was) + " usual price &minus; " + money(deal.sale) + " sale price = <strong>" +
      money(deal.was - deal.sale) + " saved (" + pct + "% off)</strong> &middot; Deal score " + dealScore(deal) + "/100</p>",
    "<dl>",
    "<dt>Store</dt><dd>" + deal.store + "</dd>",
    "<dt>Sale window</dt><dd>" + deal.window + "</dd>",
    "<dt>Verdict</dt><dd>" + deal.verdict + "</dd>",
    "<dt>Evidence</dt><dd>" + deal.evidence + "</dd>",
    "<dt>Before you buy</dt><dd>" + deal.note + "</dd>",
    "<dt>Checked</dt><dd>" + checkedOn + "</dd>",
    "<dt>Price source</dt><dd>" + deal.source + "</dd>",
    "</dl>",
    '<p><a class="btn btn-store" href="' + deal.url + '" target="_blank" rel="noopener">View at ' + deal.store + "</a></p>"
  ].join("");
}
