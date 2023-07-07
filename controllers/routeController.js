const express = require("express");
const router = express.Router();
const Route = require("../models/route");

// GET /cruxtrack/myRoutes - List of Routes
router.get("/myRoutes", async (req, res) => {
  try {
    const routes = await Route.find();
    res.render("myRoutes", { routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/route/:id - Specific Route Details
router.get("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    res.render("routeDetails", { route });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/route/:id/edit - Edit Route Page
router.get("/route/:id/edit", async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).send("Route not found");
    }

    res.render("editRoute", { route });
  } catch (error) {
    console.error("Error fetching route details:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST /cruxtrack/route/:id - Update Route
router.post("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    const { name, difficulty, type, location, ticks } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      { name, difficulty, type, location, ticks },
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).send("Route not found");
    }

    res.redirect("/cruxtrack/myRoutes");
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE /cruxtrack/route/:id - Delete Route
router.delete("/route/:id", async (req, res) => {
  try {
    const routeId = req.params.id;
    await Route.findByIdAndDelete(routeId);
    res.redirect("/cruxtrack/myRoutes");
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /cruxtrack/newRoute - Add New Route Page
router.get("/newRoute", (req, res) => {
  res.render("newRoute");
});

// POST /cruxtrack/newRoute - Create a New Route
router.post("/newRoute", async (req, res) => {
  try {
    const { name, difficulty, type, location, ticks } = req.body;
    const newRoute = new Route({
      name,
      difficulty,
      type,
      location,
      ticks,
    });
    await newRoute.save();
    console.log("New route created:", newRoute);
    res.redirect("/cruxtrack/myRoutes");
  } catch (error) {
    console.error("Error creating new route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
