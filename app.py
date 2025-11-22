# ===================== app.py with Full Comments =====================
# Semua fitur: Test server, Test DB, Register, Login, Logout, CRUD Users

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from config.db import get_db

# Membuat instance aplikasi Flask
# __name__ menentukan path modul saat ini
app = Flask(__name__)

# Secret key untuk session (penting untuk menjaga keamanan session)
app.secret_key = "ini_rahasia_panjang_ganti_aja"

# Mengaktifkan CORS agar frontend (browser) dapat request ke backend
CORS(app, supports_credentials=True)


# ======================= ROUTE: HOME =======================
# Digunakan untuk test cepat apakah server sudah berjalan
@app.route("/")
def home():
    return "Shop API is running!"


# ======================= ROUTE: TEST DATABASE =======================
# Mengecek apakah Flask berhasil terkoneksi ke MySQL
@app.route("/test-db")
def test_db():
    try:
        db = get_db()                  # Membuka koneksi ke database
        cursor = db.cursor()           # Membuat cursor untuk eksekusi SQL
        cursor.execute("SHOW TABLES;") # Menampilkan semua tabel

        # Mengambil data tabel dalam bentuk list
        tables = [row[0] for row in cursor.fetchall()]

        cursor.close()                 # Menutup cursor
        db.close()                     # Menutup koneksi DB

        return jsonify({"ok": True, "tables": tables})

    except Exception as e:
        # Jika ada error (misal koneksi DB salah)
        return jsonify({"ok": False, "error": str(e)}), 500


# ======================= ROUTE: REGISTER =======================
# Mendaftarkan user baru ke database
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()          # Mengambil JSON dari body request
    email = data.get("email")
    password = data.get("password")

    # Validasi input
    if not email or not password:
        return jsonify({"ok": False, "message": "Email dan password wajib diisi"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Mengecek apakah email sudah terdaftar
    cursor.execute("SELECT * FROM users WHERE Email = %s", (email,))
    existing = cursor.fetchone()

    if existing:
        cursor.close()
        db.close()
        return jsonify({"ok": False, "message": "Email sudah terdaftar"}), 400

    # Mengubah password menjadi hash (lebih aman)
    hashed = generate_password_hash(password)

    # Query insert ke database
    cursor.execute(
        "INSERT INTO users (Email, Password, IsActive, created_at) VALUES (%s, %s, %s, %s)",
        (email, hashed, 1, datetime.now())
    )

    db.commit()                         # Menyimpan perubahan
    user_id = cursor.lastrowid          # Mengambil ID user baru

    cursor.close()
    db.close()

    return jsonify({"ok": True, "message": "Registrasi berhasil", "user_id": user_id}), 201


# ======================= ROUTE: LOGIN =======================
# User login dengan email dan password
@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Validasi input
    if not email or not password:
        return jsonify({"ok": False, "message": "Email dan password wajib diisi"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Cari user berdasarkan email
    cursor.execute("SELECT * FROM users WHERE Email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return jsonify({"ok": False, "message": "Email tidak ditemukan"}), 401

    if not user["IsActive"]:
        return jsonify({"ok": False, "message": "Akun tidak aktif"}), 403

    # Verifikasi password dengan hash
    if not check_password_hash(user["Password"], password):
        return jsonify({"ok": False, "message": "Password salah"}), 401

    # Menyimpan session login
    session["user_id"] = user["UserId"]
    session["email"] = user["Email"]

    return jsonify({
        "ok": True,
        "message": "Login berhasil",
        "user": {
            "id": user["UserId"],
            "email": user["Email"]
        }
    })


# ======================= ROUTE: LOGOUT =======================
@app.route("/auth/logout", methods=["GET"])
def logout():
    session.clear()                     # Menghapus session user
    return jsonify({"ok": True, "message": "Logout berhasil"})


# ======================= ROUTE: GET ALL USERS =======================
@app.route("/users", methods=["GET"])
def get_users():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT UserId, Email, IsActive, created_at FROM users")
    users = cursor.fetchall()           # Mengambil semua user

    cursor.close()
    db.close()

    return jsonify(users)


# ======================= ROUTE: GET USER BY ID =======================
@app.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT UserId, Email, IsActive, created_at FROM users WHERE UserId = %s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return jsonify({"ok": False, "message": "User tidak ditemukan"}), 404

    return jsonify({"ok": True, "user": user})


# ======================= ROUTE: CREATE USER (ADMIN) =======================
@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    is_active = data.get("is_active", 1)

    if not email or not password:
        return jsonify({"ok": False, "message": "Email dan password wajib diisi"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Cek email sudah ada
    cursor.execute("SELECT * FROM users WHERE Email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        db.close()
        return jsonify({"ok": False, "message": "Email sudah ada"}), 400

    hashed = generate_password_hash(password)

    cursor.execute(
        "INSERT INTO users (Email, Password, IsActive, created_at) VALUES (%s, %s, %s, NOW())",
        (email, hashed, is_active)
    )

    db.commit()
    new_id = cursor.lastrowid

    cursor.close()
    db.close()

    return jsonify({"ok": True, "message": "User dibuat", "id": new_id}), 201


# ======================= ROUTE: UPDATE USER =======================
@app.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    is_active = data.get("is_active")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Cek user ada atau tidak
    cursor.execute("SELECT * FROM users WHERE UserId = %s", (user_id,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        db.close()
        return jsonify({"ok": False, "message": "User tidak ditemukan"}), 404

    # Update email
    if email:
        cursor.execute("UPDATE users SET Email = %s WHERE UserId = %s", (email, user_id))

    # Update password
    if password:
        hashed = generate_password_hash(password)
        cursor.execute("UPDATE users SET Password = %s WHERE UserId = %s", (hashed, user_id))

    # Update status aktif / nonaktif
    if is_active is not None:
        cursor.execute("UPDATE users SET IsActive = %s WHERE UserId = %s", (is_active, user_id))

    db.commit()
    cursor.close()
    db.close()

    return jsonify({"ok": True, "message": "User berhasil diupdate"})


# ======================= ROUTE: DELETE USER =======================
@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    db = get_db()
    cursor = db.cursor()

    # Cek apakah user ada
    cursor.execute("SELECT * FROM users WHERE UserId = %s", (user_id,))
    if not cursor.fetchone():
        cursor.close()
        db.close()
        return jsonify({"ok": False, "message": "User tidak ditemukan"}), 404

    # Hapus user
    cursor.execute("DELETE FROM users WHERE UserId = %s", (user_id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"ok": True, "message": "User berhasil dihapus"})

# ======================= CRUD PRODUCTS =======================
# Dokumentasi CRUD:
# - GET /products → Ambil semua produk
# - GET /products/<id> → Ambil produk berdasarkan ID
# - POST /products → Tambah produk baru
# - PUT /products/<id> → Update produk
# - DELETE /products/<id> → Hapus produk

# Catatan Tabel:
# products (ProductID PK, CategoryID FK, Name, Price, Stock, created_at)


# ============================================================
# READ ALL PRODUCTS
# ============================================================
@app.route("/products", methods=["GET"])
def get_products():
    """
    Mengambil semua data produk dari tabel 'products'.
    Tidak memerlukan parameter.
    """
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT ProductID, CategoryID, Name, Price, Stock, created_at FROM products")
    products = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(products)


# ============================================================
# READ PRODUCT BY ID
# ============================================================
@app.route("/products/<int:product_id>", methods=["GET"])
def get_product_by_id(product_id):
    """
    Mengambil satu produk berdasarkan ProductID.
    Param:
        product_id (int) → ID produk yang ingin dicari
    """
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT ProductID, CategoryID, Name, Price, Stock, created_at FROM products WHERE ProductID = %s",
        (product_id,),
    )
    product = cursor.fetchone()

    cursor.close()
    db.close()

    # Jika produk tidak ditemukan → response 404
    if not product:
        return jsonify({"ok": False, "message": "Product tidak ditemukan"}), 404

    return jsonify({"ok": True, "product": product})


# ============================================================
# CREATE PRODUCT
# ============================================================
@app.route("/products", methods=["POST"])
def create_product():
    """
    Menambah produk baru ke tabel products.
    Data JSON yang harus dikirim:
        - name (string)
        - category_id (int)
        - price (number)
        - stock (int)
    """

    data = request.get_json()
    name = data.get("name")
    category_id = data.get("category_id")
    price = data.get("price")
    stock = data.get("stock")

    # Validasi input
    if not name or category_id is None or price is None or stock is None:
        return jsonify({
            "ok": False,
            "message": "name, category_id, price, stock wajib diisi"
        }), 400

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO products (CategoryID, Name, Price, Stock, created_at)
        VALUES (%s, %s, %s, %s, NOW())
        """,
        (category_id, name, price, stock),
    )
    db.commit()

    product_id = cursor.lastrowid  # Mendapatkan ID produk baru

    cursor.close()
    db.close()

    return jsonify({
        "ok": True,
        "message": "Product berhasil dibuat",
        "id": product_id
    }), 201


# ============================================================
# UPDATE PRODUCT
# ============================================================
@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    """
    Mengupdate data produk berdasarkan ProductID.
    Client boleh mengirim salah satu atau beberapa field:
        - name
        - category_id
        - price
        - stock
    Field yang tidak dikirim → tidak diubah.
    """

    data = request.get_json()
    name = data.get("name")
    category_id = data.get("category_id")
    price = data.get("price")
    stock = data.get("stock")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Cek apakah produk ada
    cursor.execute("SELECT * FROM products WHERE ProductID = %s", (product_id,))
    product = cursor.fetchone()

    if not product:
        cursor.close()
        db.close()
        return jsonify({"ok": False, "message": "Product tidak ditemukan"}), 404

    # Siapkan query update dinamis
    fields = []
    values = []

    if name is not None:
        fields.append("Name = %s")
        values.append(name)
    if category_id is not None:
        fields.append("CategoryID = %s")
        values.append(category_id)
    if price is not None:
        fields.append("Price = %s")
        values.append(price)
    if stock is not None:
        fields.append("Stock = %s")
        values.append(stock)

    # Eksekusi update kalau ada field yang dikirim
    if fields:
        values.append(product_id)
        sql = f"UPDATE products SET {', '.join(fields)} WHERE ProductID = %s"
        cursor.execute(sql, tuple(values))
        db.commit()

    cursor.close()
    db.close()

    return jsonify({"ok": True, "message": "Product berhasil diupdate"})


# ============================================================
# DELETE PRODUCT
# ============================================================
@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    db = get_db()
    cursor = db.cursor()

    try:
        # cek apakah dipakai di transaction_details
        cursor.execute(
            "SELECT COUNT(*) FROM transaction_details WHERE ProductID = %s",
            (product_id,)
        )
        count = cursor.fetchone()[0]

        if count > 0:
            cursor.close()
            db.close()
            return jsonify({
                "ok": False,
                "message": "Produk ini sudah dipakai di transaksi, tidak boleh dihapus."
            }), 400

        # hapus dari products
        cursor.execute("DELETE FROM products WHERE ProductID = %s", (product_id,))
        if cursor.rowcount == 0:
            cursor.close()
            db.close()
            return jsonify({"ok": False, "message": "Produk tidak ditemukan"}), 404

        db.commit()
        cursor.close()
        db.close()
        return jsonify({"ok": True, "message": "Produk berhasil dihapus"}), 200

    except Exception as e:
        db.rollback()
        cursor.close()
        db.close()
        return jsonify({
            "ok": False,
            "message": f"Gagal menghapus produk: {str(e)}"
        }), 500




# ======================= RUN APPLICATION =======================
# debug=True memungkinkan aplikasi otomatis restart ketika ada perubahan kode
if __name__ == "__main__":
    app.run(debug=True)
