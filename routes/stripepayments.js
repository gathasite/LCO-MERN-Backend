const express = require("express");
const router = express.Router();
const { makepayment } = require("../controllers/stripepayments");

router.post("/stripepayments", makepayment);

module.exports = router;
