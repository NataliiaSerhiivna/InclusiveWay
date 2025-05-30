import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.post("/", (req, res) => {
  res.status(200).send("ok");
});

router.get("/:id", (req, res) => {});

router.patch("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.post("/:id/review", (req, res) => {
  const id = req.params.id;
  res.status(200).send(`review added to ${id}`);
});
export default router;
