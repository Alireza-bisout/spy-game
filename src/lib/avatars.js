export const PLAYER_ICONS = [
  "fa-user",
  "fa-user-tie",
  "fa-user-secret",
  "fa-user-ninja",
  "fa-user-graduate",
  "fa-user-doctor",
  "fa-user-shield",
  "fa-user-pen",
  "fa-user-gear",
  "fa-masks-theater",
  "fa-hat-cowboy",
  "fa-crown",
];

export function nextIcon(current) {
  const i = PLAYER_ICONS.indexOf(current);
  return PLAYER_ICONS[(i + 1) % PLAYER_ICONS.length];
}

export const CATEGORY_ICONS = {
  objects: "fa-box",
  animals: "fa-paw",
  celebs: "fa-star",
  tech: "fa-microchip",
  football: "fa-futbol",
  places: "fa-location-dot",
  food: "fa-utensils",
  snacks: "fa-cookie",
  jobs: "fa-briefcase",
  series: "fa-tv",
  history: "fa-landmark",
  cartoons: "fa-child",
  books: "fa-book",
  proverbs: "fa-quote-right",
};
