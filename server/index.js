const express = require('express');
const app = express();
const sqldb = require('sqlite3').verbose()
const cors = require('cors')
const db = new sqldb.Database('contact-management', (error) => {
  if (error) {
    console.error(error)
  } else {
    console.log("::::::: Data base conection was sucessful :::::::")
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS customers (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                phone_number TEXT NOT NULL UNIQUE,
                email TEXT,
                has_one_address INTEGER DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )`);
      db.run(`CREATE TABLE IF NOT EXISTS addresses (
                address_id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                address_line_1 TEXT NOT NULL,
                address_line_2 TEXT,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                pin_code TEXT NOT NULL,
                country TEXT DEFAULT 'India',
                address_type TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
            )`)
    }, (err) => {
      if (err) {
        console.log(err)

      } else {
        console.log('table created successfully')
      }

    })
  }
})
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(cors())

app.get('/customers', (req, res) => {
  db.all('SELECT * FROM customers', (error, rows) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ customers: rows });
  });
});



app.listen(port, () => {
  console.log(`${process.env.PORT} Example app listening at http://localhost:${port}`);
})