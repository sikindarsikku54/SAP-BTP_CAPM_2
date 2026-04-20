function getBase() {
  const host = window.location.hostname;
  return host.includes("applicationstudio.cloud.sap") ? "/router" : "";
}

const AUTH_API = "/odata/v4/auth";

async function login() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  if (!usernameInput || !passwordInput) { alert("Input fields not found ❌"); return; }
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) { alert("Enter username & password"); return; }
  const res = await fetch("/odata/v4/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.value === true) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", username);
    const base = getBase();
    window.location.href = base ? base + "/dashboard/index.html" : "/dashboard/index.html";
  } else {
    alert("Invalid login ❌ OR If your new Register 😊");
  }
}

async function register() {
  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;
  if (!username || !password) { alert("Enter all fields"); return; }
  const res = await fetch("/odata/v4/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.value === true) {
    alert("Registered ✅");
    window.location.href = "login.html";
  } else {
    alert("User already exists ❌");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("user");
  const base = getBase();
  window.location.href = base ? base + "/auth/login.html" : "/auth/login.html";
}
