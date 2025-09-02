const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const db = new sqlite3.Database("contactManagement", (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log("::::::: Database connection was successful :::::::");
    db.serialize(
      () => {
        db.run(`CREATE TABLE IF NOT EXISTS customers (
        customerId INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phoneNumber TEXT NOT NULL UNIQUE,
        hasOneAddress INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);
        db.run(`CREATE TABLE IF NOT EXISTS addresses (
        addressId INTEGER PRIMARY KEY AUTOINCREMENT,
        customerId INTEGER NOT NULL,
        addressLine TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pinCode TEXT NOT NULL,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customerId) REFERENCES customers(customerId) ON DELETE CASCADE
      )`);
      },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Tables created successfully");
        }
      }
    );
  }
});

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Get all customers
app.get("/customers", (req, res) => {
  db.all("SELECT * FROM customers", (error, rows) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ customers: rows });
  });
});

// Save customer and address
app.post("/saveCustomer", (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    addressLine,
    city,
    state,
    pinCode,
  } = req.body;

  // Validation
  const errors = [];
  if (!firstName || firstName.trim().length < 2)
    errors.push("First name is required and should be at least 2 characters.");
  if (!lastName || lastName.trim().length < 2)
    errors.push("Last name is required and should be at least 2 characters.");
  if (!phoneNumber || !/^\d{10}$/.test(phoneNumber))
    errors.push("Phone number is required and should be 10 digits.");
  if (!addressLine || addressLine.trim().length < 3)
    errors.push("Address Line is required and should be at least 3 characters.");
  if (!city || city.trim().length < 2)
    errors.push("City is required and should be at least 2 characters.");
  if (!state || state.trim().length < 2)
    errors.push("State is required and should be at least 2 characters.");
  if (!pinCode || !/^\d{6}$/.test(pinCode))
    errors.push("Pin code is required and should be 6 digits.");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Check for duplicate phone number
  db.get(
    `SELECT customerId FROM customers WHERE phoneNumber = ?`,
    [phoneNumber],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        return res.status(409).json({ error: "Phone number already exists." });
      }

      // Insert customer
      db.run(
        `INSERT INTO customers (firstName, lastName, phoneNumber, hasOneAddress) VALUES (?, ?, ?, ?)`,
        [firstName, lastName, phoneNumber, 1],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          const customerId = this.lastID;
          db.run(
            `INSERT INTO addresses (customerId, addressLine, city, state, pinCode) VALUES (?, ?, ?, ?, ?)`,
            [
              customerId,
              addressLine,
              city,
              state,
              pinCode
            ],
            function (err2) {
              if (err2) {
                return res.status(500).json({ error: err2.message });
              }
              res.status(201).json({ customerId });
            }
          );
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
