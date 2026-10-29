import app from "./app.js";
import connectDB from "./config/connectDB.js";

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`GoKart server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection warning on server start:", err.message);
    app.listen(PORT, () => {
      console.log(`GoKart server running on port ${PORT} (DB not connected)`);
    });
  });
