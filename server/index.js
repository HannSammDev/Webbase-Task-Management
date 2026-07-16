const express = require("express");
const cors = require("cors");

require("./firebaseAdmin");

const { getAuth } = require("firebase-admin/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.delete("/delete-user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    await getAuth().deleteUser(uid);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});