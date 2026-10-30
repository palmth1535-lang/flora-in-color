
/* ==============================
   FLORA IN COLOR
   INTERACTIVE COLLECTION
============================== */

// ELEMENTS
const cards = Array.from(
  document.querySelectorAll(".card")
);

const filterButtons = document.querySelectorAll(
  ".filters button"
);

const colorLinks = document.querySelectorAll(
  ".swatch"
);

const count = document.getElementById(
  "visible-count"
);

const view = document.getElementById(
  "specimen-view"
);

const closeButton = document.getElementById(
  "close-view"
);

const previousButton = document.getElementById(
  "previous-card"
);

const nextButton = document.getElementById(
  "next-card"
);

// STATE
let visibleCards = cards.slice();
let currentCardIndex = 0;
let lastFocusedElement = null;

// COLOR INFORMATION
const colorNames = {
  yellow: "YELLOW / สีเหลือง",
  purple: "PURPLE / สีม่วง",
  white: "WHITE / สีขาว",
  red: "RED / สีแดง",
  blue: "BLUE / สีน้ำเงิน",
  green: "GREEN / สีเขียว"
};

const colorValues = {
  yellow: "#E7C84B",
  purple: "#9877B7",
  white: "#F4F0E6",
  red: "#C84B4B",
  blue: "#668FC5",
  green: "#66845B"
};

// FILTER COLLECTION
function filterCollection(color) {
  cards.forEach(function(card) {
    const matches =
      color === "all" ||
      card.dataset.color === color;

    card.hidden = !matches;
  });

  visibleCards = cards.filter(function(card) {
    return !card.hidden;
  });

  count.textContent = visibleCards.length;

  // Update filter button appearance
  filterButtons.forEach(function(button) {
    const isActive =
      button.dataset.filter === color;

    button.classList.toggle("active", isActive);
    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );
  });

  // Close detail view when changing categories
  closeDetail();
}

// FILTER BUTTON EVENTS
filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    filterCollection(button.dataset.filter);
  });
});

// COLOR CIRCLE EVENTS
colorLinks.forEach(function(button) {
  button.addEventListener("click", function() {
    filterCollection(button.dataset.filter);

    document.getElementById("collection")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  });
});

// SHOW DETAIL PAGE
function showDetail(index) {
  if (visibleCards.length === 0) {
    return;
  }

  // Wrap around when reaching the first or last card
  currentCardIndex =
    (index + visibleCards.length) %
    visibleCards.length;

  const card = visibleCards[currentCardIndex];
  const image = card.querySelector("img");
  const color = card.dataset.color;

  const detailImage = document.getElementById(
    "detail-image"
  );

  // Image
  detailImage.src = image.src;
  detailImage.alt = image.alt;

  // Plant information
  document.getElementById(
    "detail-title"
  ).textContent = card.dataset.title;

  document.getElementById(
    "detail-scientific"
  ).textContent = card.dataset.scientific;

  document.getElementById(
    "detail-description"
  ).textContent = card.dataset.description;

  // Color information
  document.getElementById(
    "detail-color-name"
  ).textContent = colorNames[color];

  document.getElementById(
    "detail-dot"
  ).style.setProperty(
    "--detail-color",
    colorValues[color]
  );

  // Original specimen number
  const originalIndex = cards.indexOf(card) + 1;

  document.getElementById(
    "detail-number"
  ).textContent =
    "SPECIMEN NO." +
    String(originalIndex).padStart(2, "0");

  // Position in the current filtered collection
  document.getElementById(
    "detail-position"
  ).textContent =
    String(currentCardIndex + 1).padStart(2, "0") +
    " / " +
    String(visibleCards.length).padStart(2, "0");

  // Disable navigation when only one item exists
  previousButton.disabled =
    visibleCards.length <= 1;

  nextButton.disabled =
    visibleCards.length <= 1;

  // Open detail view
  view.classList.add("is-open");
  view.setAttribute("aria-hidden", "false");

  document.body.classList.add("detail-open");

  closeButton.focus();
}

// CLOSE DETAIL PAGE
function closeDetail() {
  if (!view.classList.contains("is-open")) {
    return;
  }

  view.classList.remove("is-open");
  view.setAttribute("aria-hidden", "true");

  document.body.classList.remove("detail-open");

  // Return focus to the last selected card
  if (
    lastFocusedElement &&
    document.contains(lastFocusedElement) &&
    !lastFocusedElement.closest(".card")?.hidden
  ) {
    lastFocusedElement.focus();
  }
}

// OPEN CARD ON CLICK
cards.forEach(function(card) {
  const button = card.querySelector(".card-button");

  button.addEventListener("click", function() {
    lastFocusedElement = button;

    const index = visibleCards.indexOf(card);

    if (index !== -1) {
      showDetail(index);
    }
  });
});

// NEXT SPECIMEN
function nextDetail() {
  if (visibleCards.length > 1) {
    showDetail(currentCardIndex + 1);
  }
}

// PREVIOUS SPECIMEN
function previousDetail() {
  if (visibleCards.length > 1) {
    showDetail(currentCardIndex - 1);
  }
}

// NAVIGATION BUTTONS
nextButton.addEventListener(
  "click",
  nextDetail
);

previousButton.addEventListener(
  "click",
  previousDetail
);

// CLOSE BUTTON
closeButton.addEventListener(
  "click",
  closeDetail
);

// KEYBOARD CONTROLS
document.addEventListener("keydown", function(event) {
  if (!view.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeDetail();
  }

  if (event.key === "ArrowRight") {
    nextDetail();
  }

  if (event.key === "ArrowLeft") {
    previousDetail();
  }
});

// INITIALIZE
filterCollection("all");
