// Mock domain data — no backend (see BRIEF.md "Implementation"). Mirrors DOMAIN.md
// §D4 J1 (formula submission → fulfillment → pickup) and §D5 (data model).

/** Stage order for J1, steps 2–7. Index doubles as timeline position. */
export const STAGES = [
  {
    key: "received",
    label: "Formula received",
    glance: "Your formula has arrived at Groundwork Apothecary.",
    timelineNote: "Order received from Rohan Jasani",
  },
  {
    key: "under_review",
    label: "Under review",
    glance: "Safety and stock checks are in progress.",
    timelineNote: "Safety and stock checks",
  },
  {
    key: "in_prep",
    label: "In preparation",
    glance: "Your formula is being compounded at the bench.",
    timelineNote: "Compounded at the bench",
  },
  {
    key: "ready",
    label: "Ready for pickup",
    glance: "Ready! Swing by whenever works for you.",
    timelineNote: "Ready for pickup",
  },
  {
    key: "picked_up",
    label: "Picked up",
    glance: "All done — your dosing instructions are saved below.",
    timelineNote: "Picked up",
  },
];

export function stageIndex(key) {
  return STAGES.findIndex((s) => s.key === key);
}

/**
 * Exception metadata. `tone` drives color per DESIGN.md's calm-by-default rule:
 * "calm" reuses the neutral/leaf palette, "attention" uses amber, "blocking" is the
 * only case that earns rust — reserved for things that truly stop pickup.
 */
export const EXCEPTIONS = {
  needs_input: {
    tone: "attention",
    title: "We need something from you",
    message: "Quick check before we continue: do you want this as a tea or a tincture?",
    cta: "Answer now",
  },
  waiting_on_practitioner: {
    tone: "calm",
    title: "Waiting on Rohan",
    message:
      "A safety check needs your practitioner's sign-off before we continue. We'll update you the moment it clears — nothing needed from you.",
    cta: null,
  },
  delayed_backorder: {
    tone: "attention",
    title: "One ingredient is delayed",
    message: "A component is on backorder. We've pushed your estimate back — no action needed.",
    cta: null,
  },
  payment_required: {
    tone: "blocking",
    title: "Payment didn't go through",
    message: "Your card was declined. Try again or use a different method.",
    cta: "Retry payment",
  },
};

function hoursFromNow(h) {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}
function hoursAgo(h) {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}

/** The active order Priya is tracking right now. */
export function createActiveOrder() {
  return {
    id: "ord_2024_0912",
    practitioner: "Rohan Jasani",
    client: "Priya Raman",
    stage: "under_review",
    exception: null,
    timestamps: {
      received: hoursAgo(3),
      under_review: hoursAgo(2),
      in_prep: null,
      ready: null,
      picked_up: null,
    },
    eta: hoursFromNow(5),
    formula: {
      name: "Priya's quarterly blend",
      components: [
        { latin: "Withania somnifera", part: "root", form: "cut & sift", common: "Ashwagandha", proportion: "2 parts" },
        { latin: "Melissa officinalis", part: "aerial", form: "cut & sift", common: "Lemon balm", proportion: "1 part" },
        { latin: "Glycyrrhiza glabra", part: "root", form: "cut & sift", common: "Licorice", proportion: "0.5 part" },
      ],
      dosing: "1 tsp steeped 10 min, twice daily",
      prepMethod: "Simmer roots gently for 15 minutes, then add remaining herbs and steep 10 minutes off heat, covered.",
      safetyNotes: [
        { text: "Contains a low-dose botanical (licorice) — do not exceed the stated dose without checking with Rohan.", warning: true },
        { text: "Avoid if pregnant or nursing.", warning: true },
      ],
    },
    payment: {
      amount: 42.0,
      status: "pending", // pending | paid | failed
      method: { brand: "Visa", last4: "4242" },
      autopay: false,
    },
    pickup: {
      address: "118 Elm Street, Ashland, OR",
      hours: "Mon–Fri 10–6, Sat 10–3",
      phone: "(541) 555-0134",
      mapUrl: "https://maps.google.com/?q=118+Elm+Street,+Ashland,+OR",
      whatToBring: ["Photo ID", "Payment method (skip this if autopay is on)"],
    },
  };
}

/** Past, already-picked-up formulas — M9 history / reopenable reference (M7). */
export const HISTORY = [
  {
    id: "ord_2024_0612",
    pickedUpAt: new Date(Date.UTC(2024, 5, 14, 17, 30)),
    formula: {
      name: "Priya's spring blend",
      components: [
        { latin: "Urtica dioica", part: "aerial", form: "cut & sift", common: "Nettle", proportion: "2 parts" },
        { latin: "Taraxacum officinale", part: "root", form: "cut & sift", common: "Dandelion", proportion: "1 part" },
      ],
      dosing: "1 tsp steeped 10 min, once daily",
      prepMethod: "Steep 10 minutes in just-boiled water, covered.",
      safetyNotes: [{ text: "No low-dose botanicals in this formula.", warning: false }],
    },
  },
  {
    id: "ord_2024_0314",
    pickedUpAt: new Date(Date.UTC(2024, 2, 15, 16, 10)),
    formula: {
      name: "Priya's winter blend",
      components: [
        { latin: "Withania somnifera", part: "root", form: "cut & sift", common: "Ashwagandha", proportion: "2 parts" },
        { latin: "Zingiber officinale", part: "root", form: "cut & sift", common: "Ginger", proportion: "1 part" },
      ],
      dosing: "1 tsp steeped 10 min, twice daily",
      prepMethod: "Simmer 15 minutes, then steep 10 minutes off heat.",
      safetyNotes: [{ text: "No low-dose botanicals in this formula.", warning: false }],
    },
  },
];
