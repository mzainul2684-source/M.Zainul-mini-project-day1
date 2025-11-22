<h1 align="center">🛍️ Shop API Dashboard</h1>
<p align="center">
  Fullstack Mini Project — Flask + MySQL + REST API + Dashboard
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue?logo=python" />
  <img src="https://img.shields.io/badge/Flask-API-green?logo=flask" />
  <img src="https://img.shields.io/badge/MySQL-Database-orange?logo=mysql" />
  <img src="https://img.shields.io/badge/Frontend-HTML/CSS/JS-yellow" />
</p>

---

## 📌 Deskripsi

Shop API Dashboard adalah project fullstack sederhana yang menggabungkan:

✅ Backend API menggunakan Flask  
✅ Database MySQL  
✅ Frontend Dashboard interaktif  
✅ Autentikasi & Manajemen User  
✅ CRUD Produk & User  
✅ Activity Log & Toast Notification  

Project ini dibuat sebagai latihan mengembangkan aplikasi web dengan arsitektur:


---

## 🚀 Tech Stack

**Backend**
- Python 3
- Flask
- Flask-CORS
- mysql-connector-python
- Werkzeug (hashing)

**Frontend**
- HTML
- CSS
- JavaScript (Fetch API)

**Database**
- MySQL

---

## 📂 Struktur Project

<pre><code>
shop_api/
├── app.py                 # Main Flask API
├── config/
│   └── db.py              # Koneksi MySQL
├── frontend/
│   ├── index.html         # UI Dashboard
│   ├── css/
│   │   └── style.css      # Styling UI
│   └── js/
│       └── app.js         # Logic frontend
├── venv/                  # Virtual environment
├── .gitignore
└── pyvenv.cfg
</code></pre>

---

## 🧪 Endpoint API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| GET | `/auth/logout` | Logout user |
| GET | `/users` | Get all users |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/products` | Get products |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

---

## 📸 Dokumentasi ENDPOINT

<img width="1919" height="1199" alt="Screenshot 2025-11-22 172940" src="https://github.com/user-attachments/assets/ccc0aa94-fd2f-4c15-8d33-bd87a5b6dab7" />
<img width="1919" height="1199" alt="Screenshot 2025-11-22 172907" src="https://github.com/user-attachments/assets/9e61f006-7cba-46f4-85cf-9bc98d8ecf0b" />
<img width="1915" height="1198" alt="Screenshot 2025-11-22 172834" src="https://github.com/user-attachments/assets/b02b3559-c5cc-44ee-bff4-fbce244ad461" />
<img width="1919" height="1199" alt="Screenshot 2025-11-22 173141" src="https://github.com/user-attachments/assets/0a92ed1b-1feb-4380-96a3-489cd326c910" />
<img width="1919" height="1199" alt="Screenshot 2025-11-22 173024" src="https://github.com/user-attachments/assets/497b4331-9b10-440b-953e-4cd402068c4f" />
<img width="1917" height="1198" alt="Screenshot 2025-11-22 173443" src="https://github.com/user-attachments/assets/c0405f84-6175-4963-a140-a8bef5637b6f" />
<img width="1919" height="1186" alt="Screenshot 2025-11-22 173412" src="https://github.com/user-attachments/assets/3afe7592-d56e-4f22-b19e-8a11abfde7a7" />
<img width="1919" height="1199" alt="Screenshot 2025-11-22 173333" src="https://github.com/user-attachments/assets/ab4c1fcd-abb3-46c5-a55e-e9a7baa088f7" />
<img width="1917" height="1198" alt="Screenshot 2025-11-22 173306" src="https://github.com/user-attachments/assets/351401e1-7e3f-44e4-ba87-6526a643de12" />
<img width="1919" height="1199" alt="Screenshot 2025-11-22 173207" src="https://github.com/user-attachments/assets/38657a2c-e467-4c73-871c-5c05fa2293a2" />

---

## 📸 Preview UI

<p align="center">
  <img width="700" src="https://github.com/user-attachments/assets/96753199-e544-45fa-9e7b-0b5366666585" />
  <img width="700" src="https://github.com/user-attachments/assets/52d81eb0-7b22-450f-9cf2-3f1ae0bfa315" />
  <img width="700" src="https://github.com/user-attachments/assets/9996e571-3337-43db-8948-b82af4995ee4" />
</p>

---

## 🚀 Cara Menjalankan

<pre><code>
git clone https://github.com/mzainul2684-source/M.Zainul-mini-project-day1.git
cd M.Zainul-mini-project-day1

python -m venv venv
venv\Scripts\activate

pip install flask flask-cors mysql-connector-python werkzeug python-dotenv

python app.py
</code></pre>

API berjalan di:
http://127.0.0.1:5000

Frontend:
frontend/index.html

---

## 🗄️ Setup Database MySQL

<pre><code>
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
</code></pre>

---

## 👤 Author

**M. Zainul Karohman**  
Telkom University Surabaya — Teknologi Informasi

---

## ⭐ Repository

https://github.com/mzainul2684-source/M.Zainul-mini-project-day1
