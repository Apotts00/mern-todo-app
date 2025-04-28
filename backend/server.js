// BLOCK 1: Importing Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const tasks = require('./routes/tasks');  

// BLOCK 2: Configuring the Express App
dotenv.config();

const app = express();

// BLOCK 3: Setting Up Middleware
app.use(cors());
app.use(express.json());

// BLOCK 4: Connecting to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1); // Exit process with failure
  }
};

// Call the database connection function
connectDB();

// BLOCK 5: Defining Routes
const tasksRoutes = require("./routes/tasks");
app.use("/api/tasks", tasksRoutes);

// BLOCK 6: Starting the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); // Ensure this is at the top of the file
require("dotenv").config(); // Load environment variables

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
