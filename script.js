// Liste des stations 2026
const stations = [
  "ON4BAF/P","ON4CDZ/P","ON4CPN/P","ON4FA/P","ON4KSD/P","ON4MCL/P",
  "ON4MLB/P","ON4MNS/P","ON4OSA/P","ON4PHI/P","ON4RAT/P","ON4RCA/P",
  "ON4SNW/P","ON4TOR/P","ON5CLR/P","ON5LL/P","ON5UB/P","ON5VL/P",
  "ON6NB/P","ON6SI/P","ON6UB/P","ON6WL/P","ON6ZY/P","OQ2A/P",
  "OR4D/P","OR5N/P","OR7C/P","OT2L/P","OT2X/P","OT4O/P",
  "ON4RAC/P","ON5UG/P","ON6ZT/P","OP6A/P"
];

// Génération du tableau
const tbody = document.querySelector("#fdTable tbody");

stations.forEach(call => {
  const tr = document.createElement("tr");
  tr.id = call;

  tr.innerHTML = `
    <td>${call}</td>
    <td class="b160"></td>
    <td class="b80"></td>
    <td class="b40"></td>
  `;

  tbody.appendChild(tr);
});

// Connexion WebSocket
const ws = new WebSocket("ws://localhost:8765");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const call = data.call.toUpperCase();
  const band = data.band;

  const row = document.getElementById(call);
  if (!row) return;

  if (band === "160m") row.querySelector(".b160").classList.add("active160");
  if (band === "80m")  row.querySelector(".b80").classList.add("active80");
  if (band === "40m")  row.querySelector(".b40").classList.add("active40");
};
