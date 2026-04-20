// Base URL (IMPORTANT)
const BASE_URL = "/odata/v4/my";

// Detects if running locally or in Cloud Foundry
function getBasePath() {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "..";  // local: relative paths work
  }
  return "";      // CF: use absolute paths
}
const BASE = getBasePath();

// Loader animation
function showLoading() {
  document.getElementById("data").innerHTML = `
    <div class="loading-center">
      🔄 Loading data...
    </div>
  `;
}

// Error display
function showError() {
  document.getElementById("data").innerHTML = `
    <div class="error-center">
      ❌ Error loading data
    </div>
  `;
}

// ================= VEHICLES =================
function loadVehicles() {
  showLoading();

  fetch(`${BASE_URL}/Vehicles`)
    .then(res => res.json())
    .then(data => {
      const html = `
        <h2 style="color:white; text-align:center;">🏍 Vehicles</h2>
        <div class="grid">
          ${data.value.map(v => `
            <div class="card">
              <h3>${v.model}</h3>
              <p><b>ID:</b> ${v.ID}</p>
              <p><b>Vehicle Code:</b> ${v.vehicleId}</p>
              <p><b>New Price:</b> ₹${v.newPrice}</p>
              <p><b>Old Price:</b> ₹${v.oldPrice}</p>

              <button class="delete-btn"
                onclick="deleteItem('Vehicles', ${v.ID})">
                Delete ❌
              </button>
            </div>
          `).join("")}
        </div>
      `;
      document.getElementById("data").innerHTML = html;
    })
    .catch(showError);
}

// ================= STATES =================
function loadStates() {
  showLoading();

  fetch(`${BASE_URL}/States`)
    .then(res => res.json())
    .then(data => {
      const html = `
        <h2 style="color:white; text-align:center;">🌍 States</h2>
        <table class="table">
          <tr><th>ID</th><th>Code</th><th>Name</th><th>Action</th></tr>
          ${data.value.map(s => `
            <tr>
              <td>${s.ID}</td>
              <td>${s.stateId}</td>
              <td>${s.stateName}</td>
              <td>
                <button class="delete-btn"
                  onclick="deleteItem('States', ${s.ID})">
                  Delete ❌
                </button>
              </td>
            </tr>
          `).join("")}
        </table>
      `;
      document.getElementById("data").innerHTML = html;
    })
    .catch(showError);
}

// ================= CUSTOMERS =================
function loadCustomers() {
  showLoading();

  fetch(`${BASE_URL}/Customers`)
    .then(res => res.json())
    .then(data => {
      const html = `
        <h2 style="color:white; text-align:center;">👤 Customers</h2>
        <div class="grid">
          ${data.value.map(c => `
            <div class="card">
              <h3>${c.customerName}</h3>
              <p>ID: ${c.ID}</p>

              <button class="delete-btn"
                onclick="deleteItem('Customers', '${c.ID}')">
                Delete ❌
              </button>
            </div>
          `).join("")}
        </div>
      `;
      document.getElementById("data").innerHTML = html;
    })
    .catch(showError);
}

// ================= DEALERS =================
function loadDealers() {
  showLoading();

  fetch(`${BASE_URL}/Dealers`)
    .then(res => res.json())
    .then(data => {
      const html = `
        <h2 style="color:white; text-align:center;">🏬 Dealers</h2>
        <table class="table">
          <tr><th>ID</th><th>Name</th><th>Action</th></tr>
          ${data.value.map(d => `
            <tr>
              <td>${d.ID}</td>
              <td>${d.dealerName}</td>
              <td>
                <button class="delete-btn"
                  onclick="deleteItem('Dealers', '${d.ID}')">
                  Delete ❌
                </button>
              </td>
            </tr>
          `).join("")}
        </table>
      `;
      document.getElementById("data").innerHTML = html;
    })
    .catch(showError);
}

// ================= ORDERS =================
function loadOrders() {
  showLoading();

  fetch(`${BASE_URL}/Orders`)
    .then(res => res.json())
    .then(data => {
      const html = `
        <h2 style="color:white; text-align:center;">📦 Orders</h2>
        <table class="table">
          <tr><th>ID</th><th>Date</th><th>Action</th></tr>
          ${data.value.map(o => `
            <tr>
              <td>${o.ID}</td>
              <td>${o.orderDate}</td>
              <td>
                <button class="delete-btn"
                  onclick="deleteItem('Orders', '${o.ID}')">
                  Delete ❌
                </button>
              </td>
            </tr>
          `).join("")}
        </table>
      `;
      document.getElementById("data").innerHTML = html;
    })
    .catch(showError);
}

// ================= DELETE =================
async function deleteItem(entity, id) {

  const password = prompt("Enter password to delete:");
  if (!password) {
    alert("⚠️ Please enter password");
    return;
  }

  if (password !== "sikindhar") {
    alert("Wrong password ❌");
    return;
  }

  if (!confirm("Are you sure?")) return;

  try {
    let url;

    if (entity === "Vehicles" || entity === "States") {
      url = `${BASE_URL}/${entity}(${id})`;
    } else {
      url = `${BASE_URL}/${entity}('${id}')`;
    }

    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed ❌");
      return;
    }

    alert("Deleted successfully ✅");

    if (entity === "Vehicles") loadVehicles();
    else if (entity === "States") loadStates();
    else if (entity === "Customers") loadCustomers();
    else if (entity === "Dealers") loadDealers();
    else if (entity === "Orders") loadOrders();

  } catch (err) {
    console.error(err);
    alert("Delete failed ❌");
  }
}

// ================= CREATE =================
async function createVehicle() {

  const model = document.getElementById("model").value;
  const price = document.getElementById("price").value;
  const stateId = document.getElementById("stateId").value;
  const dealerId = document.getElementById("dealerId").value;

  // ✅ VALIDATION
  if (!model || !price || !stateId || !dealerId) {
    alert("⚠️ Please provide data for all fields");
    return;
  }

  try {
    await fetch(`${BASE_URL}/Vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        newPrice: parseFloat(price),
        state_ID: parseInt(stateId),
        dealer_ID: dealerId
      })
    });

    alert("Vehicle Created 🚀");

    clearForm();   // ✅ CLEAR FORM
    loadVehicles();

  } catch (err) {
    console.error(err);
    alert("Error creating vehicle");
  }
}

// ================= UPDATE =================
async function updateVehicle() {

  const id = prompt("Enter Vehicle ID to update:");
  const price = document.getElementById("price").value;

  if (!id || !price) {
    alert("⚠️ Please provide all required data");
    return;
  }

  try {
    await fetch(`${BASE_URL}/Vehicles(${id})`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newPrice: parseFloat(price)
      })
    });

    alert("Vehicle Updated 🔄");

    clearForm();   // ✅ CLEAR FORM
    loadVehicles();

  } catch (err) {
    console.error(err);
    alert("Error updating vehicle");
  }
}

// ================= CLEAR FORM =================
function clearForm() {
  document.getElementById("model").value = "";
  document.getElementById("price").value = "";
  document.getElementById("stateId").value = "";
  document.getElementById("dealerId").value = "";
}


function openExplorer() {
  const base = (window.location.hostname === "localhost" || 
                window.location.hostname === "127.0.0.1") ? ".." : "";
  window.location.href = `${base}/explorer/index.html`;
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  const base = (window.location.hostname === "localhost" || 
                window.location.hostname === "127.0.0.1") ? ".." : "";
  window.location.href = `${base}/auth/login.html`;
}