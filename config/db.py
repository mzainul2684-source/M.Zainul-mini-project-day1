import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",        # ganti kalau user MySQL kamu beda
        password="26Zainul-$",        # kalau MySQL kamu pakai password, isi di sini
        database="shop_db"  # ini nama database yang tadi kita buat
    )