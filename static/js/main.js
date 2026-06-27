// const map = L.map("map").setView([12.8406, 80.1534], 12); 
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors"
// }).addTo(map);

// const markers = []; 

// const CAT_COLORS = {
//   Plastic: "#3b82f6",
//   "E-Waste": "#8b5cf6",
//   Organic:  "#22c55e",
//   Glass:    "#06b6d4",
//   Metal:    "#f59e0b",
//   Paper:    "#f97316",
// };

// async function loadStats() {
//   try {
//     const res  = await fetch("/api/stats");
//     const data = await res.json();
//     const strip = document.getElementById("statsStrip");
//     strip.innerHTML = "";

//     if (!data.success || data.stats.length === 0) {
//       strip.innerHTML = '<div class="stat-pill">No data yet — be the first to log!</div>';
//       return;
//     }

//     const grandTotal = data.stats.reduce((s, r) => s + parseFloat(r.total_weight), 0).toFixed(2);
//     strip.innerHTML += `<div class="stat-pill">🌍 Total Logged: ${grandTotal} kg</div>`;

//     data.stats.forEach(row => {
//       strip.innerHTML += `<div class="stat-pill">${row.category}: ${row.total_weight} kg (${row.entries} entries)</div>`;
//     });
//   } catch (err) {
//     console.error("Stats error:", err);
//   }
// }

// async function loadLogs() {
//   try {
//     const res  = await fetch("/api/logs");
//     const data = await res.json();
//     const feed = document.getElementById("feed");

//     if (!data.success || data.logs.length === 0) {
//       feed.innerHTML = '<p class="loading-text">No logs yet. Submit your first one above! 🌱</p>';
//       return;
//     }

//     feed.innerHTML = "";
//     data.logs.forEach(log => {
//       const slug = log.category.replace(/[^a-z]/gi, "").toLowerCase();
//       feed.innerHTML += `
//         <div class="log-card cat-${slug}">
//           <div class="cat">${log.category}</div>
//           <div class="wt">${log.weight_kg} <span>kg</span></div>
//           <div class="coords">📍 ${parseFloat(log.latitude).toFixed(4)}, ${parseFloat(log.longitude).toFixed(4)}</div>
//           <div class="time">🕐 ${log.logged_at}</div>
//         </div>`;

//       const color = CAT_COLORS[log.category] || "#52b788";
//       // const icon  = L.divIcon({
//       //   className: "",
//       //   html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
//       //   iconSize: [14, 14],
//       //   iconAnchor: [7, 7]
//       // });
//       // const marker = L.marker([log.latitude, log.longitude], { icon }).addTo(map);
//       // marker.bindPopup(`<b>${log.category}</b><br>${log.weight_kg} kg<br><small>${log.logged_at}</small>`);
//       // markers.push(marker);
//     });

//     // if (markers.length > 0) {
//     //   const group = L.featureGroup(markers);
//     //   map.fitBounds(group.getBounds().pad(0.3));
//     // }
//   } catch (err) {
//     console.error("Logs error:", err);
//   }
// }

// async function submitLog() {
//   const category = document.getElementById("category").value.trim();
//   const weight   = document.getElementById("weight").value.trim();
//   const btn      = document.getElementById("submitBtn");
//   const msg      = document.getElementById("formMsg");
//   const geoStatus= document.getElementById("geoStatus");

  
//   if (!category) return showMsg("Please select a waste category.", "err");
//   if (!weight || parseFloat(weight) <= 0) return showMsg("Enter a valid weight > 0.", "err");

//   if (!navigator.geolocation) {
//     return showMsg("Your browser doesn't support geolocation.", "err");
//   }

//   btn.disabled   = true;
//   btn.textContent = "Getting location…";
//   geoStatus.textContent = "📡 Requesting GPS coordinates…";

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const lat = position.coords.latitude;
//       const lng = position.coords.longitude;
//       geoStatus.textContent = `✅ Captured: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

//       try {
//         const res  = await fetch("/api/logs", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ category, weight, latitude: lat, longitude: lng })
//         });
//         const data = await res.json();

//         if (data.success) {
//           showMsg("✅ Log saved successfully!", "ok");
//           document.getElementById("category").value = "";
//           document.getElementById("weight").value   = "";
//           geoStatus.textContent = "📍 Location will be captured on submit";
//           const r = data.result;

//           // populate result card
//           const methodMap = {
//             "Composting": ["🌱 Composting", "badge-compost"],
//             "Recycling":  ["♻️ Recycling",  "badge-recycle"],
//             "Landfill":   ["🏗️ Landfill",   "badge-landfill"]
//           };
//           const [label, badgeClass] = methodMap[r.processing_method];

//           document.getElementById("resultBadge").textContent  = label;
//           document.getElementById("resultBadge").className    = "result-badge " + badgeClass;
//           document.getElementById("resultTitle").textContent  = r.solution.title;
//           document.getElementById("resultIdea").textContent   = r.solution.idea;
//           document.getElementById("resultBenefit").textContent = r.solution.benefit;
//           document.getElementById("resultAction").textContent = "👉 " + r.solution.action;

//           // show terracotta box only if recommended
//           document.getElementById("terracottaBox").style.display =
//             r.terracotta_recommended ? "block" : "none";

//           // show the result card, hide the form
//           document.getElementById("resultCard").style.display = "block";
//           document.querySelector(".form-card").style.display  = "none";

//           // scroll to result
//           document.getElementById("resultCard").scrollIntoView({ behavior: "smooth" });
                
//           await loadStats();
//           await loadLogs();
//         } else {
//           showMsg("Error: " + data.error, "err");
//         }
//       } catch (err) {
//         showMsg("Network error. Is Flask running?", "err");
//       }

//       btn.disabled = false;
//       btn.textContent = "Submit Log";
//     },

//     // (error) => {
//     //   btn.disabled = false;
//     //   btn.textContent = "Submit Log";

//     //   if (error.code === error.PERMISSION_DENIED) {
//     //     geoStatus.textContent = "❌ Location denied";
//     //     showMsg("You denied location access. EcoAudit needs GPS to prevent fraud. Please allow it and retry.", "err");
//     //   } else if (error.code === error.POSITION_UNAVAILABLE) {
//     //     geoStatus.textContent = "❌ Location unavailable";
//     //     showMsg("GPS signal unavailable. Try again outdoors or check device settings.", "err");
//     //   } else {
//     //     geoStatus.textContent = "❌ Location timeout";
//     //     showMsg("Location request timed out. Please retry.", "err");
//     //   }
//     // },

//     { timeout: 10000 }   
//   );
// }

// function showMsg(text, type) {
//   const el = document.getElementById("formMsg");
//   el.textContent  = text;
//   el.className    = "form-msg " + type;
// }

// loadStats();
// loadLogs();

// function paymentDone() {
//   // hide result, show form again for next entry
//   document.getElementById("resultCard").style.display  = "none";
//   document.querySelector(".form-card").style.display   = "block";
//   showMsg("✅ Thank you! Log complete.", "ok");
//   // clear the success message after 3 seconds
//   setTimeout(() => {
//     document.getElementById("formMsg").textContent = "";
//   }, 3000);
// }



const map = L.map("map").setView([12.8406, 80.1534], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const CAT_COLORS = {
  Plastic: "#3b82f6",
  "E-Waste": "#8b5cf6",
  Organic:  "#22c55e",
  Glass:    "#06b6d4",
  Metal:    "#f59e0b",
  Paper:    "#f97316",
};

async function loadStats() {
  try {
    const res  = await fetch("/api/stats");
    const data = await res.json();
    const strip = document.getElementById("statsStrip");
    strip.innerHTML = "";

    if (!data.success || data.stats.length === 0) {
      strip.innerHTML = '<div class="stat-pill">No data yet — be the first to log!</div>';
      return;
    }

    const grandTotal = data.stats.reduce((s, r) => s + parseFloat(r.total_weight), 0).toFixed(2);
    strip.innerHTML += `<div class="stat-pill">🌍 Total Logged: ${grandTotal} kg</div>`;

    data.stats.forEach(row => {
      strip.innerHTML += `<div class="stat-pill">${row.category}: ${row.total_weight} kg (${row.entries} entries)</div>`;
    });
  } catch (err) {
    console.error("Stats error:", err);
  }
}

async function loadLogs() {
  try {
    const res  = await fetch("/api/logs");
    const data = await res.json();
    const feed = document.getElementById("feed");

    if (!data.success || data.logs.length === 0) {
      feed.innerHTML = '<p class="loading-text">No logs yet. Submit your first one above! 🌱</p>';
      return;
    }

    feed.innerHTML = "";
    data.logs.forEach(log => {
      const slug = log.category.replace(/[^a-z]/gi, "").toLowerCase();
      feed.innerHTML += `
        <div class="log-card cat-${slug}">
          <div class="cat">${log.category}</div>
          <div class="wt">${log.weight} <span>kg</span></div>
          <div class="coords">📍 ${parseFloat(log.latitude).toFixed(4)}, ${parseFloat(log.longitude).toFixed(4)}</div>
          <div class="time">🕐 ${log.log_time}</div>
        </div>`;
    });

  } catch (err) {
    console.error("Logs error:", err);
  }
}

async function submitLog() {
  const category  = document.getElementById("category").value.trim();
  const weight    = document.getElementById("weight").value.trim();
  const btn       = document.getElementById("submitBtn");
  const geoStatus = document.getElementById("geoStatus");

  if (!category) return showMsg("Please select a waste category.", "err");
  if (!weight || parseFloat(weight) <= 0) return showMsg("Enter a valid weight > 0.", "err");

  if (!navigator.geolocation) {
    return showMsg("Your browser doesn't support geolocation.", "err");
  }

  btn.disabled    = true;
  btn.textContent = "Getting location…";
  geoStatus.textContent = "📡 Requesting GPS coordinates…";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      geoStatus.textContent = `✅ Captured: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      try {
        const res  = await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, weight, latitude: lat, longitude: lng })
        });
        const data = await res.json();

        if (data.success) {
          const r = data.result;

          // populate result card
          const methodMap = {
            "Composting": ["🌱 Composting", "badge-compost"],
            "Recycling":  ["♻️ Recycling",  "badge-recycle"],
            "Landfill":   ["🏗️ Landfill",   "badge-landfill"]
          };
          const [label, badgeClass] = methodMap[r.processing_method];

          document.getElementById("resultBadge").textContent   = label;
          document.getElementById("resultBadge").className     = "result-badge " + badgeClass;
          document.getElementById("resultTitle").textContent   = r.solution.title;
          document.getElementById("resultIdea").textContent    = r.solution.idea;
          document.getElementById("resultBenefit").textContent = r.solution.benefit;
          document.getElementById("resultAction").textContent  = "👉 " + r.solution.action;

          document.getElementById("terracottaBox").style.display =
            r.terracotta_recommended ? "block" : "none";

          document.getElementById("resultCard").style.display = "block";
          document.querySelector(".form-card").style.display  = "none";

          document.getElementById("resultCard").scrollIntoView({ behavior: "smooth" });

          document.getElementById("category").value = "";
          document.getElementById("weight").value   = "";
          geoStatus.textContent = "📍 Location will be captured on submit";

          await loadStats();
          await loadLogs();

        } else {
          showMsg("Error: " + data.error, "err");
        }
      } catch (err) {
        showMsg("Network error. Is Flask running?", "err");
      }

      btn.disabled    = false;
      btn.textContent = "Submit Log";
    },

    (error) => {
      btn.disabled    = false;
      btn.textContent = "Submit Log";
      if (error.code === error.PERMISSION_DENIED) {
        geoStatus.textContent = "❌ Location denied";
        showMsg("You denied location access. EcoAudit needs GPS to prevent fraud. Please allow it and retry.", "err");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        geoStatus.textContent = "❌ Location unavailable";
        showMsg("GPS signal unavailable. Try again outdoors or check device settings.", "err");
      } else {
        geoStatus.textContent = "❌ Location timeout";
        showMsg("Location request timed out. Please retry.", "err");
      }
    },

    { timeout: 10000 }
  );
}

function showMsg(text, type) {
  const el = document.getElementById("formMsg");
  el.textContent = text;
  el.className   = "form-msg " + type;
}

async function handleDisposalAction(action) {
  try {
    await fetch("/api/logs/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
  } catch (err) {
    console.error("Action update failed:", err);
  }

  document.getElementById("resultCard").style.display = "none";
  document.querySelector(".form-card").style.display  = "block";
  showMsg("✅ Thank you for logging! Action recorded.", "ok");
  setTimeout(() => {
    document.getElementById("formMsg").textContent = "";
  }, 3000);
}

function droppedAtPoint() { handleDisposalAction("Dropped"); }
function bookedPickup()    { handleDisposalAction("Doorstep"); }
function donated()         { handleDisposalAction("Donated"); }

loadStats();
loadLogs();