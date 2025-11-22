// ==============================
// CONFIG: Base URL API Backend
// ==============================

// Alamat API Flask kamu (lokal)
const API_BASE = "http://127.0.0.1:5000";


// ==============================
// TOAST NOTIFICATION
// ==============================

// Elemen toast dari HTML
const toastEl = document.getElementById("toast");
let toastTimeout;

/*
  showToast():
  - Menampilkan notifikasi kecil (success/error)
  - Muncul 3 detik, lalu hilang otomatis
*/
function showToast(message, type = "success") {
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.className = "toast"; // reset class
  toastEl.classList.add("show", type); // tambahkan class show + tipe (warna)

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);
}


// ==============================
// MESSAGE HELPER (Pesan di bawah form)
// ==============================

/*
  setMessage():
  - Menampilkan pesan text kecil di bawah form (success/error)
*/
function setMessage(el, text, type = "success") {
  el.textContent = text || "";
  el.classList.remove("success", "error"); // reset warna

  if (text) el.classList.add(type);
}


// ==============================
// TAB SYSTEM (Sidebar Navigation)
// ==============================

// Ambil semua tombol tab (Auth, Users, Products)
const tabs = document.querySelectorAll(".tab");
// Ambil semua konten tab (div tab-content)
const tabContents = document.querySelectorAll(".tab-content");

/*
  Logika switch-tab:
  - Klik tab → semua tab disembunyikan, tab target ditampilkan
  - Jika tab Users/Product dibuka, otomatis load data tabel
*/
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.tab; // contoh: "usersTab"

    // Hilangkan active pada semua tab
    tabs.forEach(t => t.classList.remove("active"));
    // Sembunyikan semua konten tab
    tabContents.forEach(c => (c.style.display = "none"));

    // Aktifkan tab yang diklik
    tab.classList.add("active");
    // Tampilkan isi tab yang sesuai
    document.getElementById(targetId).style.display = "grid";

    // Auto load data
    if (targetId === "usersTab") loadUsers();
    if (targetId === "productsTab") loadProducts();
  });
});

// ==============================
// THEME TOGGLE (Dark / Light Mode)
// ==============================

// Tombol toggle tema dari HTML
const themeToggle = document.getElementById("themeToggle");

/*
  updateThemeLabel():
  - Mengubah teks tombol sesuai mode sekarang
  - Jika body punya class "light-mode" → label jadi "🌞 Light"
  - Kalau tidak → dianggap "dark-mode" → label "🌙 Dark"
*/
function updateThemeLabel() {
  if (document.body.classList.contains("light-mode")) {
    themeToggle.textContent = "🌞 Light";
  } else {
    themeToggle.textContent = "🌙 Dark";
  }
}

// Event ketika tombol tema diklik
themeToggle.addEventListener("click", () => {
  // Jika sekarang dark-mode → ganti ke light-mode
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
  } else {
    // Jika sekarang light-mode → ganti ke dark-mode
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }
  // Update teks tombol
  updateThemeLabel();
});

// Set label awal saat halaman pertama kali dimuat
updateThemeLabel();


// ==============================
// API STATUS CHECKER
// ==============================

// Elemen status di header dan sidebar
const serverStatusEl = document.getElementById("serverStatus");
const sidebarApiStatusEl = document.getElementById("sidebarApiStatus");

// Menyimpan status API terakhir:
// - null (belum cek)
// - true (online)
// - false (offline)
let lastApiStatusOk = null;

/*
  checkServerStatus():
  - Mengirim request ke /test-db
  - Jika ok → update tampilan status menjadi "Connected"
  - Jika gagal → update status "Offline / not reachable"
  - Parameter isInterval = true jika dipanggil dari setInterval (untuk showToast hanya ketika perubahan status)
*/
async function checkServerStatus(isInterval = false) {
  try {
    const res = await fetch(API_BASE + "/test-db");
    if (!res.ok) throw new Error();
    const data = await res.json();

    if (data.ok) {
      // Update status di header
      serverStatusEl.textContent = "● Connected to API";
      serverStatusEl.style.background = "rgba(22, 163, 74, 0.18)";
      serverStatusEl.style.borderColor = "rgba(34, 197, 94, 0.8)";

      // Update status di sidebar
      sidebarApiStatusEl.textContent = "● API Online";
      sidebarApiStatusEl.style.background = "rgba(22, 163, 74, 0.12)";
      sidebarApiStatusEl.style.borderColor = "rgba(34, 197, 94, 0.8)";
      sidebarApiStatusEl.style.color = "#bbf7d0";

      // Jika sebelumnya offline lalu sekarang online → tampilkan toast
      if (lastApiStatusOk === false && isInterval) {
        showToast("API kembali online", "success");
      }
      lastApiStatusOk = true;
    } else {
      // Jika data.ok false → anggap error
      throw new Error();
    }
  } catch {
    // Jika request gagal atau error
    serverStatusEl.textContent = "● API not reachable";
    serverStatusEl.style.background = "rgba(127, 29, 29, 0.45)";
    serverStatusEl.style.borderColor = "rgba(239, 68, 68, 0.7)";

    sidebarApiStatusEl.textContent = "● API Offline";
    sidebarApiStatusEl.style.background = "rgba(127, 29, 29, 0.45)";
    sidebarApiStatusEl.style.borderColor = "rgba(239, 68, 68, 0.7)";
    sidebarApiStatusEl.style.color = "#fecaca";

    // Jika sebelumnya online lalu sekarang offline → tampilkan toast
    if (lastApiStatusOk === true && isInterval) {
      showToast("API offline / tidak bisa diakses", "error");
    }
    lastApiStatusOk = false;
  }
}

// Cek status API saat halaman pertama kali dibuka
checkServerStatus(false);

// Cek API setiap 5 detik (monitoring berkala)
setInterval(() => checkServerStatus(true), 5000);


// ==============================
// ACTIVITY LOG
// ==============================

// Elemen daftar log aktivitas di HTML
const activityLogEl = document.getElementById("activityLog");

/*
  logActivity():
  - Mencatat aktivitas request API dalam bentuk:
    [HH:MM:SS] METHOD /endpoint → statusCode
  - Ditampilkan di list (#activityLog), baris terbaru ditaruh di atas (prepend)
*/
function logActivity(method, endpoint, ok, statusCode) {
  if (!activityLogEl) return;

  const li = document.createElement("li");
  const ts = new Date().toLocaleTimeString();

  li.innerHTML =
    `[${ts}] <span class="method">${method}</span> ${endpoint} → ` +
    `<span class="${ok ? "status-ok" : "status-error"}">${statusCode}</span>`;

  // Taruh log terbaru di paling atas
  activityLogEl.prepend(li);
}


// ==============================
// Helper apiFetch() — wrapper fetch + log + toast
// ==============================

/*
  apiFetch():
  - Membungkus fetch() biasa dengan tambahan:
    • Logging ke Activity Log
    • Optional toast (success / error)
    • Parsing JSON response
  - Param:
    • endpoint: string, misal "/auth/login"
    • options: config fetch (method, headers, body)
    • toastLabel: label teks untuk toast (misal "Login", "Create user")
*/
async function apiFetch(endpoint, options = {}, toastLabel = "") {
  const url = API_BASE + endpoint;
  const method = (options.method || "GET").toUpperCase();

  try {
    const res = await fetch(url, options);
    // Coba parse JSON, kalau gagal (bukan JSON) → pakai objek kosong
    const data = await res.json().catch(() => ({}));

    // Catat aktivitas ke Activity Log
    logActivity(method, endpoint, res.ok, res.status);

    // Jika toastLabel diisi, tampilkan toast sesuai hasil request
    if (toastLabel) {
      if (res.ok && (data.ok === undefined || data.ok === true)) {
        showToast(`${toastLabel} berhasil`, "success");
      } else {
        showToast(`${toastLabel} gagal`, "error");
      }
    }

    // Kembalikan objek { res, data } agar bisa dicek di pemanggil
    return { res, data };
  } catch (err) {
    // Jika fetch gagal total (misal koneksi error)
    logActivity(method, endpoint, false, "ERR");
    showToast(`Error koneksi ke server`, "error");
    throw err;
  }
}

// ==============================
// AUTH: REGISTER
// ==============================

// Ambil elemen-elemen yang terkait dengan register
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");
const regClearBtn = document.getElementById("regClearBtn");

/*
  Event submit form register:
  - Mencegah submit bawaan browser (preventDefault)
  - Mengambil nilai email & password
  - Memanggil endpoint POST /auth/register via apiFetch()
  - Menampilkan pesan sukses/gagal di bawah form
*/
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  // Tampilkan pesan sementara
  setMessage(registerMessage, "Processing...", "success");

  try {
    const { res, data } = await apiFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, "Registrasi"); // label untuk toast

    if (res.ok && data.ok) {
      // Jika backend mengembalikan ok: true
      setMessage(
        registerMessage,
        data.message || "Registrasi berhasil",
        "success"
      );
      // Reset form setelah berhasil
      registerForm.reset();
    } else {
      // Jika status bukan 2xx atau data.ok false
      setMessage(
        registerMessage,
        data.message || "Gagal registrasi",
        "error"
      );
    }
  } catch {
    // Jika error koneksi / server
    setMessage(registerMessage, "Error menghubungi server", "error");
  }
});

/*
  Tombol "Clear" pada form register:
  - Mengosongkan semua input
  - Menghapus pesan status di bawah form
*/
regClearBtn.addEventListener("click", () => {
  registerForm.reset();
  setMessage(registerMessage, "");
});


// ==============================
// AUTH: LOGIN & LOGOUT
// ==============================

// Ambil elemen-elemen yang terkait dengan login/logout
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

/*
  Event submit form login:
  - Mengirim email & password ke endpoint POST /auth/login
  - Menampilkan pesan login berhasil/gagal
  - Session akan disimpan di backend Flask (bukan di frontend)
*/
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  setMessage(loginMessage, "Processing login...", "success");

  try {
    const { res, data } = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, "Login"); // label untuk toast

    if (res.ok && data.ok) {
      setMessage(
        loginMessage,
        data.message || "Login berhasil",
        "success"
      );
    } else {
      setMessage(
        loginMessage,
        data.message || "Login gagal",
        "error"
      );
    }
  } catch {
    setMessage(loginMessage, "Error menghubungi server", "error");
  }
});

/*
  Tombol Logout:
  - Memanggil endpoint GET /auth/logout
  - Menghapus session di backend
  - Menampilkan pesan logout berhasil/gagal
*/
logoutBtn.addEventListener("click", async () => {
  setMessage(loginMessage, "Processing logout...", "success");

  try {
    const { res, data } = await apiFetch("/auth/logout", {}, "Logout");
    if (res.ok && data.ok) {
      setMessage(
        loginMessage,
        data.message || "Logout berhasil",
        "success"
      );
    } else {
      setMessage(
        loginMessage,
        data.message || "Logout gagal",
        "error"
      );
    }
  } catch {
    setMessage(loginMessage, "Error menghubungi server", "error");
  }
});

// ==============================
// USERS CRUD
// ==============================

// Elemen-elemen yang terkait dengan users
const usersTableBody = document.getElementById("usersTableBody");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const createUserBtn = document.getElementById("createUserBtn");
const updateUserBtn = document.getElementById("updateUserBtn");
const deleteUserBtn = document.getElementById("deleteUserBtn");
const userFormMessage = document.getElementById("userFormMessage");

/*
  loadUsers():
  - Mengambil data users dari endpoint GET /users
  - Mengisi tabel di UI dengan hasil response
  - Menampilkan status loading / error / data kosong
*/
async function loadUsers() {
  // Tampilkan pesan sementara di tabel selama menunggu response
  usersTableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const { res, data } = await apiFetch("/users");

    if (res.ok && Array.isArray(data)) {
      // Jika tidak ada user
      if (data.length === 0) {
        usersTableBody.innerHTML = "<tr><td colspan='4'>Belum ada user</td></tr>";
      } else {
        // Render setiap baris user ke dalam <tr>
        usersTableBody.innerHTML = data.map(u => `
          <tr>
            <td>${u.UserId}</td>
            <td>${u.Email}</td>
            <td>
              <span class="pill ${u.IsActive ? "pill-active" : "pill-inactive"}">
                ${u.IsActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td>${u.created_at ?? ""}</td>
          </tr>
        `).join("");
      }
    } else {
      // Jika response tidak sesuai ekspektasi (bukan array)
      usersTableBody.innerHTML = "<tr><td colspan='4'>Response tidak sesuai</td></tr>";
    }
  } catch {
    // Jika gagal fetch ke server
    usersTableBody.innerHTML = "<tr><td colspan='4'>Gagal load data users</td></tr>";
  }
}

// Tombol refresh untuk memanggil loadUsers() secara manual
refreshUsersBtn.addEventListener("click", loadUsers);


/*
  CREATE USER
  - Mengambil data dari form (email, password, status)
  - Mengirim request POST /users
  - Menampilkan pesan di bawah form + toast + reload tabel
*/
createUserBtn.addEventListener("click", async () => {
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  const is_active = document.getElementById("userActive").value;

  // Validasi sederhana: email & password wajib
  if (!email || !password) {
    setMessage(userFormMessage, "Email dan password wajib diisi untuk create", "error");
    return;
  }

  setMessage(userFormMessage, "Processing create...", "success");

  try {
    const { res, data } = await apiFetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        is_active: Number(is_active),
      }),
    }, "Create user"); // label toast

    if (res.ok && data.ok) {
      setMessage(
        userFormMessage,
        data.message || "User berhasil dibuat",
        "success"
      );
      // Reload tabel setelah create sukses
      loadUsers();
    } else {
      setMessage(
        userFormMessage,
        data.message || "Gagal membuat user",
        "error"
      );
    }
  } catch {
    setMessage(userFormMessage, "Error menghubungi server", "error");
  }
});


/*
  UPDATE USER
  - Mengambil User ID + field yang diisi dari form
  - Membuat payload hanya dari field yang tidak kosong
  - Mengirim request PUT /users/:id
*/
updateUserBtn.addEventListener("click", async () => {
  const id = document.getElementById("userId").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();
  const is_active = document.getElementById("userActive").value;

  // User ID wajib untuk update
  if (!id) {
    setMessage(userFormMessage, "User ID wajib diisi untuk update", "error");
    return;
  }

  // Build payload dinamis: hanya kirim field yang diisi
  const payload = {};
  if (email) payload.email = email;
  if (password) payload.password = password;
  payload.is_active = Number(is_active);

  setMessage(userFormMessage, "Processing update...", "success");

  try {
    const { res, data } = await apiFetch(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }, "Update user");

    if (res.ok && data.ok) {
      setMessage(
        userFormMessage,
        data.message || "User berhasil diupdate",
        "success"
      );
      loadUsers();
    } else {
      setMessage(
        userFormMessage,
        data.message || "Gagal update user",
        "error"
      );
    }
  } catch {
    setMessage(userFormMessage, "Error menghubungi server", "error");
  }
});


/*
  DELETE USER
  - Mengambil User ID dari form
  - Konfirmasi lewat dialog confirm()
  - Mengirim request DELETE /users/:id
*/
deleteUserBtn.addEventListener("click", async () => {
  const id = document.getElementById("userId").value.trim();

  // User ID wajib untuk delete
  if (!id) {
    setMessage(userFormMessage, "User ID wajib diisi untuk delete", "error");
    return;
  }

  // Konfirmasi sebelum menghapus
  if (!confirm("Yakin ingin menghapus user ini?")) return;

  setMessage(userFormMessage, "Processing delete...", "success");

  try {
    const { res, data } = await apiFetch(`/users/${id}`, {
      method: "DELETE",
    }, "Delete user");

    if (res.ok && data.ok) {
      setMessage(
        userFormMessage,
        data.message || "User berhasil dihapus",
        "success"
      );
      loadUsers();
    } else {
      setMessage(
        userFormMessage,
        data.message || "Gagal menghapus user",
        "error"
      );
    }
  } catch {
    setMessage(userFormMessage, "Error menghubungi server", "error");
  }
});

// ==============================
// PRODUCTS CRUD
// ==============================

// Elemen-elemen yang terkait dengan produk
const productsTableBody = document.getElementById("productsTableBody");
const refreshProductsBtn = document.getElementById("refreshProductsBtn");
const createProductBtn = document.getElementById("createProductBtn");
const updateProductBtn = document.getElementById("updateProductBtn");
const deleteProductBtn = document.getElementById("deleteProductBtn");
const productFormMessage = document.getElementById("productFormMessage");

/*
  loadProducts():
  - Mengambil data produk dari endpoint GET /products
  - Mengisi tabel Products Table di UI
  - Menampilkan status loading / kosong / error
*/
async function loadProducts() {
  // Pesan sementara saat data sedang di-load
  productsTableBody.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";

  try {
    const { res, data } = await apiFetch("/products");

    if (res.ok && Array.isArray(data)) {
      // Jika belum ada data produk
      if (data.length === 0) {
        productsTableBody.innerHTML =
          "<tr><td colspan='6'>Belum ada produk</td></tr>";
      } else {
        // Render setiap produk ke baris tabel
        productsTableBody.innerHTML = data
          .map(
            (p) => `
          <tr>
            <td>${p.ProductID}</td>
            <td>${p.Name}</td>
            <td>
              <span class="pill pill-small pill-tag">
                ${p.CategoryID}
              </span>
            </td>
            <td>${p.Price}</td>
            <td>${p.Stock}</td>
            <td>${p.created_at ?? ""}</td>
          </tr>
        `
          )
          .join("");
      }
    } else {
      // Jika response tidak berupa array
      productsTableBody.innerHTML =
        "<tr><td colspan='6'>Response tidak sesuai</td></tr>";
    }
  } catch {
    // Jika gagal konek ke server
    productsTableBody.innerHTML =
      "<tr><td colspan='6'>Gagal load data products</td></tr>";
  }
}

// Tombol Refresh Products → memanggil loadProducts()
refreshProductsBtn.addEventListener("click", loadProducts);


/*
  CREATE PRODUCT
  - Mengambil data dari form produk
  - Mengirim request POST /products
  - Menampilkan pesan hasil create + reload tabel
*/
createProductBtn.addEventListener("click", async () => {
  const name = document.getElementById("productName").value.trim();
  const category_id = document.getElementById("productCategory").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const stock = document.getElementById("productStock").value.trim();

  // Validasi sederhana: semua field wajib diisi
  if (!name || !category_id || !price || !stock) {
    setMessage(
      productFormMessage,
      "Semua field wajib diisi untuk create",
      "error"
    );
    return;
  }

  setMessage(productFormMessage, "Processing create...", "success");

  try {
    const { res, data } = await apiFetch(
      "/products",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category_id: Number(category_id),
          price: Number(price),
          stock: Number(stock),
        }),
      },
      "Create product" // label toast
    );

    if (res.ok && data.ok) {
      setMessage(
        productFormMessage,
        data.message || "Product berhasil dibuat",
        "success"
      );
      // Reload tabel setelah berhasil create
      loadProducts();
    } else {
      setMessage(
        productFormMessage,
        data.message || "Gagal membuat product",
        "error"
      );
    }
  } catch {
    setMessage(productFormMessage, "Error menghubungi server", "error");
  }
});


/*
  UPDATE PRODUCT
  - Mengambil Product ID + field yang ingin diubah
  - Membuat payload hanya dari field yang diisi
  - Mengirim request PUT /products/:id
*/
updateProductBtn.addEventListener("click", async () => {
  const id = document.getElementById("productId").value.trim();
  const name = document.getElementById("productName").value.trim();
  const category_id = document.getElementById("productCategory").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const stock = document.getElementById("productStock").value.trim();

  // Product ID wajib diisi untuk update
  if (!id) {
    setMessage(
      productFormMessage,
      "Product ID wajib diisi untuk update",
      "error"
    );
    return;
  }

  // Build payload dinamis
  const payload = {};
  if (name) payload.name = name;
  if (category_id) payload.category_id = Number(category_id);
  if (price) payload.price = Number(price);
  if (stock) payload.stock = Number(stock);

  setMessage(productFormMessage, "Processing update...", "success");

  try {
    const { res, data } = await apiFetch(
      `/products/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      "Update product"
    );

    if (res.ok && data.ok) {
      setMessage(
        productFormMessage,
        data.message || "Product berhasil diupdate",
        "success"
      );
      loadProducts();
    } else {
      setMessage(
        productFormMessage,
        data.message || "Gagal update product",
        "error"
      );
    }
  } catch {
    setMessage(productFormMessage, "Error menghubungi server", "error");
  }
});


/*
  DELETE PRODUCT
  - Mengambil Product ID dari form
  - Konfirmasi sebelum menghapus
  - Mengirim request DELETE /products/:id
*/
deleteProductBtn.addEventListener("click", async () => {
  const id = document.getElementById("productId").value.trim();

  // Product ID wajib diisi
  if (!id) {
    setMessage(
      productFormMessage,
      "Product ID wajib diisi untuk delete",
      "error"
    );
    return;
  }

  // Konfirmasi sebelum delete
  if (!confirm("Yakin ingin menghapus product ini?")) return;

  setMessage(productFormMessage, "Processing delete...", "success");

  try {
    const { res, data } = await apiFetch(
      `/products/${id}`,
      {
        method: "DELETE",
      },
      "Delete product"
    );

    if (res.ok && data.ok) {
      setMessage(
        productFormMessage,
        data.message || "Product berhasil dihapus",
        "success"
      );
      loadProducts();
    } else {
      setMessage(
        productFormMessage,
        data.message || "Gagal menghapus product",
        "error"
      );
    }
  } catch {
    setMessage(productFormMessage, "Error menghubungi server", "error");
  }
});
