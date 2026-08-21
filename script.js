// Bandes HF utilisées
const bands = ["160m", "80m", "40m", "20m", "15m", "10m", "6m"];

// Stations officielles 2026
const stations = [
  "ON4BAF/P","ON4CDZ/P","ON4CPN/P","ON4FA/P","ON4KSD/P","ON4MCL/P",
  "ON4MLB/P","ON4MNS/P","ON4OSA/P","ON4PHI/P","ON4RAT/P","ON4RCA/P",
  "ON4SNW/P","ON4TOR/P","ON5CLR/P","ON5LL/P","ON5UB/P","ON5VL/P",
  "ON6NB/P","ON6SI/P","ON6UB/P","ON6WL/P","ON6ZY/P","OQ2A/P",
  "OR4D/P","OR5N/P","OR7C/P","OT2L/P","OT2X/P","OT4O/P",
  "ON4RAC/P","ON5UG/P","ON6ZT/P","OP6A/P"
];

// Tableau
const tbody = document.querySelector("#fdTable tbody");

// Génération dynamique des colonnes
const header = document.getElementById("bandHeader");
bands.forEach(b => {
  const th = document.createElement("th");
  th.textContent = b;
  header.appendChild(th);
});

// Génération des stations officielles
stations.forEach(call => {
  const tr = document.createElement("tr");
  tr.id = call;

  let html = `<td>${call}</td>`;
  bands.forEach(b => {
    html += `<td class="b${b.replace('m','')}"></td>`;
  });

  tr.innerHTML = html;
  tbody.appendChild(tr);
});

// Restauration des stations ajoutées
const saved = JSON.parse(localStorage.getItem("newStations") || "[]");

saved.forEach(call => {
  const tr = document.createElement("tr");
  tr.id = call;
  tr.classList.add("new-station");

  let html = `<td><span class="new-tag">NEW</span>${call}</td>`;
  bands.forEach(b => {
    html += `<td class="b${b.replace('m','')}"></td>`;
  });

  tr.innerHTML = html;
  tbody.appendChild(tr);
});

// Tri automatique
function sortTable() {
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const isNewA = a.classList.contains("new-station");
    const isNewB = b.classList.contains("new-station");

    if (!isNewA && isNewB) return -1;
    if (isNewA && !isNewB) return 1;

    return a.id.localeCompare(b.id);
  });

  rows.forEach(r => tbody.appendChild(r));
}

sortTable();

// Sauvegarde des nouvelles stations
function saveNewStation(call) {
  let saved = JSON.parse(localStorage.getItem("newStations") || "[]");

  if (!saved.includes(call)) {
    saved.push(call);
    localStorage.setItem("newStations", JSON.stringify(saved));
  }
}

// Compteur QSO
let qsoCount = 0;
const qsoBox = document.getElementById("qsoCounter");

// Heures
function updateTime() {
  const now = new Date();

  const local = now.toLocaleTimeString("fr-FR", { hour12: false });

  const utc =
    now.getUTCHours().toString().padStart(2, "0") + ":" +
    now.getUTCMinutes().toString().padStart(2, "0") + ":" +
    now.getUTCSeconds().toString().padStart(2, "0");

  document.getElementById("localTime").textContent = "Local : " + local;
  document.getElementById("utcTime").textContent = "UTC : " + utc;
}

setInterval(updateTime, 1000);
updateTime();

// WebSocket
const ws = new WebSocket("ws://localhost:8765");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const call = data.call.toUpperCase();
  const band = data.band; // ex: "40m"

  let row = document.getElementById(call);

  // Ajout automatique si station inconnue
  if (!row) {
    row = document.createElement("tr");
    row.id = call;
    row.classList.add("new-station");

    let html = `<td><span class="new-tag">NEW</span>${call}</td>`;
    bands.forEach(b => {
      html += `<td class="b${b.replace('m','')}"></td>`;
    });

    row.innerHTML = html;
    tbody.appendChild(row);
    saveNewStation(call);
    sortTable();
  }

  // Coloration dynamique
  const className = ".b" + band.replace("m","");
  const cell = row.querySelector(className);
  if (cell) cell.classList.add("active" + band.replace("m",""));

  // Compteur
  qsoCount++;
  qsoBox.textContent = "QSO : " + qsoCount;
};

// RESET
document.getElementById("resetBtn").addEventListener("click", () => {

  qsoCount = 0;
  qsoBox.textContent = "QSO : 0";

  bands.forEach(b => {
    document.querySelectorAll(".b" + b.replace("m",""))
      .forEach(cell => cell.classList.remove("active" + b.replace("m","")));
  });
});
