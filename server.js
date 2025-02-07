require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// Mail Sending Route
app.post("/send-mail", async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure : true,
      port : 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    let info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!", info });
  } catch (error) {
    res.status(500).json({ error: "Error sending email", details: error });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
