import express from "express";
import cors from "cors";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { pool } from "../database.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

//=============================================================================================
//===================================== LOGIN Dan REGISTER ====================================
//=============================================================================================

// Endpoint Login
app.post("/api/login", async (req, res) => {
  const { username, password, role } = req.body; 
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await argon2.verify(user.password, password)) {
        if (user.role !== role) { 
          return res.status(403).send("Role tidak sesuai.");
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY);
        res.json({
          token,
          message: "Login berhasil.",
        });
      } else {
        res.status(401).send("Kata sandi salah.");
      }
    } else {
      res.status(404).send(`Pengguna dengan nama pengguna ${username} tidak ditemukan.`);
    }
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat login.");
  }
});

//Endpoint Register
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    if (role !== "user" && role !== "admin") {
      return res.status(400).send("Role tidak valid. Harus 'user' atau 'admin'.");
    }
    const hash = await argon2.hash(password);
    await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hash, role]
    );
    res.send("Pendaftaran berhasil");
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat pendaftaran.");
  }
});


function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization;
  console.log("Authorization Header:", authorization); 
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Token Verified:", req.user); 
      next();
    } catch (error) {
      console.error("Token verification error:", error); 
      res.status(401).send("Token tidak valid.");
    }
  } else {
    res.status(401).send("Anda belum login (tidak ada otorisasi).");
  }
}

// Middleware untuk memeriksa apakah pengguna adalah admin
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).send("Akses ditolak. Hanya admin yang dapat melakukan ini.");
  }
  next();
}

//=================================================================================================
//========================================== PRODUK ===============================================
//=================================================================================================

// Rute yang Dilindungi (Hanya admin)
app.post("/api/products", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, stok, imageurl) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.body.name, req.body.price, req.body.stok, req.body.imageurl]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat menambahkan produk.");
  }
});

// Rute untuk Semua Pengguna
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat mengambil produk.");
  }
});

// Update Produk (Hanya admin)
app.put("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query(
      "UPDATE products SET name = $1, price= $2, stok=$3, imageurl= $4 WHERE id = $5",
      [req.body.name, req.body.price, req.body.stok, req.body.imageurl, req.params.id]
    );
    res.json({
      message: "Produk Berhasil di edit",
    });
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat mengedit produk.");
  }
});

// Delete Produk (Hanya admin)
app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE id= $1", [req.params.id]);
    res.send("Produk berhasil dihapus");
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat menghapus produk.");
  }
});

// Middleware untuk memeriksa apakah pengguna memiliki role 'user'
function requireUser(req, res, next) {
  if (req.user.role !== "user") {
    return res.status(403).send("Akses ditolak. Hanya pengguna dengan role 'user' yang dapat melakukan ini.");
  }
  next();
}

//======================================================================================
//======================================== ORDER ========================================
//======================================================================================


// Create an Order
app.post('/api/orders', async (req, res) => {
  const { name, address, phone, items } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO orders (name, address, phone) VALUES ($1, $2, $3) RETURNING id',
      [name, address, phone]
    );

    const orderId = result.rows[0].id;

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Order placed successfully!', orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'An error occurred while placing the order.' });
  }
});

// Get Orders
app.get('/api/ordersAll', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];
  const userId = parseInt(token); 

  try {
    const result = await pool.query(
      `SELECT oi.id AS id, o.id AS order_id, o.name AS customer_name, o.address, o.phone, oi.status, oi.product_id, p.name AS product_name, oi.quantity, oi.price
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'An error occurred while fetching orders.' });
  }
});


// Update Order Status and Reduce Stock
app.put('/api/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;

  try {
    await pool.query(
      'UPDATE order_items SET status = $1 WHERE order_id = $2',
      [status, orderId]
    );

    if (status === 'Accepted') {
      const { rows: orderItems } = await pool.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [orderId]
      );

      for (const item of orderItems) {
        await pool.query(
          'UPDATE products SET stok = stok - $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }
    }

    res.status(200).json({ message: 'Order status updated successfully!' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'An error occurred while updating the order status.' });
  }
});



app.delete('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  console.log(`Deleting order with ID: ${orderId}`); // Log the orderId

  try {

    const tampung = await pool.query(
      'SELECT * FROM order_items WHERE id = $1',[orderId]
    )

    const data = tampung.rows[0];

    const insertResult = await pool.query(
      `INSERT INTO order_history (id,order_id, product_id, quantity, price,created_at) VALUES ($1, $2, $3, $4,$5,$6) `,
      [data.id,data.order_id,data.product_id,data.quantity,data.price,data.created_at]
    
    );
    
    console.log('Insert query executed:', {
      query: `INSERT INTO order_history ... WHERE o.id = ${orderId}`,
      result: insertResult
    });
    

    // // Delete order from orders and order_items
    const deleteItemsResult = await pool.query('DELETE FROM order_items WHERE order_id = $1', [data.order_id]);
    console.log('Order items deleted:', deleteItemsResult);

    res.status(200).json({ message: 'Order moved to history and deleted.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order.' });
  }
});

//======================================================================================
//=================================  HISTORY ===========================================
//======================================================================================

// GET /api/orderHistory
app.get('/api/orderHistory', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM order_history 
          `
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ message: 'Failed to fetch order history.' });
  }
});


app.get('/api/history', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];
  const userId = parseInt(token); 

  try {
    const result = await pool.query(
      `SELECT o.id AS order_id, o.name AS customer_name, o.address, o.phone, oi.status, oi.product_id, p.name AS product_name, oi.quantity, oi.price
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'An error occurred while fetching orders.' });
  }
});


app.listen(3000, () => console.log("Server berhasil dijalankan"));
