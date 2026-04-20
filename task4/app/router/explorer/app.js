const API = "/odata/v4/location";

let historyStack = [];
let forwardStack = [];
let currentData = [];

// SEARCH
async function search() {
  const state = document.getElementById("searchInput").value;

  showLoader();

  const res = await fetch(`${API}/searchState(name='${state}')`);
  const data = await res.json();

  historyStack = [];
  forwardStack = [];

  render(data.value);
}

// LOAD CHILD
async function loadChildren(item) {

  showLoader();

  historyStack.push(currentData);
  forwardStack = [];

  const res = await fetch(`${API}/getChildren(geoId='${item.geoId}')`);
  const data = await res.json();

  render(data.value);
}

// BACK
function goBack() {
  if (historyStack.length === 0) return;

  forwardStack.push(currentData);
  render(historyStack.pop());
}

// FORWARD
function goForward() {
  if (forwardStack.length === 0) return;

  historyStack.push(currentData);
  render(forwardStack.pop());
}

// LOADER
function showLoader() {
  document.getElementById("results").innerHTML =
    `<h2 style="text-align:center;">Loading...</h2>`;
}

// RENDER
function render(list) {

  currentData = list;

  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = `
      <div class="complete">
        <h1>🏁 Your Journey is Completed</h1>
      </div>
    `;
    return;
  }

  list.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>👥 Population: ${item.population}</p>
      <p class="map">📍 Open Map</p>
    `;

    card.querySelector(".map").onclick = (e) => {
      e.stopPropagation();
      window.open(`https://www.google.com/maps?q=${item.lat},${item.lng}`);
    };

    card.onclick = () => loadChildren(item);

    container.appendChild(card);
  });
}