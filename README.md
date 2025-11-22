# 🛍️ Shop API Dashboard — Mini Project Day 1

📌 Fullstack Mini Project menggunakan **Flask + MySQL + REST API + Frontend Dashboard**

Project ini dibuat sebagai latihan membangun API backend dan mengintegrasikannya dengan frontend sederhana.

Mencakup:

- RESTful API (CRUD)
- Autentikasi (Register, Login, Logout)
- Database MySQL
- Dashboard Web interaktif
- Fetch API + UI Dynamic
- Activity Log & Toast Notification

---

## 🚀 Tech Stack

### 🔧 Backend
- Python 3
- Flask
- MySQL
- mysql-connector-python
- Flask-CORS
- Werkzeug (hash password)

### 🎨 Frontend
- HTML
- CSS
- JavaScript (Fetch API)
- Vanilla JS DOM Manipulation

---

## 📂 Struktur Project

shop_api/
├── app.py # Main Flask API
├── config/
│ └── db.py # Koneksi MySQL
├── frontend/
│ ├── index.html # UI Dashboard
│ ├── css/
│ │ └── style.css # Styling UI
│ └── js/
│ └── app.js # Logic frontend (fetch API + UI)
├── venv/ # Virtual environment (ignored Git)
├── .gitignore
└── pyvenv.cfg


---

## 📸 Preview

<img width="600" src="https://github.com/user-attachments/assets/96753199-e544-45fa-9e7b-0b5366666585" />
<img width="600" src="https://github.com/user-attachments/assets/52d81eb0-7b22-450f-9cf2-3f1ae0bfa315" />
<img width="600" src="https://github.com/user-attachments/assets/9996e571-3337-43db-8948-b82af4995ee4" />

---

## 🚀 Cara Menjalankan Project

### 1️⃣ Clone Repository
git clone https://github.com/mzainul2684-source/M.Zainul-mini-project-day1.git

cd M.Zainul-mini-project-day1

### 2️⃣ Buat Virtual Environment (opsional tapi disarankan)
python -m venv venv
Aktifkan:

Windows:
venv\Scripts\activate

### 3️⃣ Install Dependencies
pip install flask flask-cors mysql-connector-python werkzeug python-dotenv

### 4️⃣ Setup Database MySQL

Buka MySQL / Workbench, lalu jalankan:

CREATE DATABASE shop_db;
USE shop_db;

CREATE TABLE users (
UserId INT AUTO_INCREMENT PRIMARY KEY,
Email VARCHAR(255) NOT NULL UNIQUE,
Password VARCHAR(255) NOT NULL,
IsActive BOOLEAN NOT NULL DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
ProductID INT AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(255),
CategoryID INT,
Price DECIMAL(10,2),
Stock INT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

makefile
Salin kode

### 5️⃣ Konfigurasi Koneksi Database

File:
config/db.py

Pastikan sesuai MySQL yang digunakan:

config = {
"host": "localhost",
"user": "root",
"password": "",
"database": "shop_db"
}

### 6️⃣ Jalankan Backend (API)
python app.py

API berjalan di:
http://127.0.0.1:5000

### 7️⃣ Jalankan Frontend
Buka:

frontend/index.html

✅ Bisa double click  
✅ Bisa pakai Live Server VSCode

---

## 🧪 Endpoint API

POST /auth/register
POST /auth/login
GET /auth/logout
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
GET /products
POST /products
PUT /products/:id
DELETE /products/:id

---

## 👤 Author

**M. Zainul Karohman**  
Telkom University Surabaya  
Teknologi Informasi

---

## 📌 Repository

https://github.com/mzainul2684-source/M.Zainul-mini-project-day1
