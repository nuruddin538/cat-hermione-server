import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import { createRemoteJWKSet, jwtVerify } from "jose";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

console.log("Successfully connected to MongoDB!");

const db = client.db(process.env.MONGODB_DB_NAME || "kindora");
const eventsCollection = db.collection("events");
const joinedEventsCollection = db.collection("joinedEvents");

// Better Auth JWT Verification
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.AUTH_URL || process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized!",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized!",
    });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    if (typeof payload.email !== "string" || !payload.email) {
      return res.status(401).send({
        success: false,
        message: "User email not found!",
      });
    }
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token!",
    });
  }
};

// Get API Status
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Impactora API is running",
  });
});

// Get 6 Upcoming Events
app.get("/api/events/recent", async (req, res) => {
  try {
    const result = await eventsCollection
      .find({
        eventDate: { $gt: new Date().toISOString() },
      })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to get recent events!",
    });
  }
});

// Get All Upcoming Events
app.get("/api/events", async (req, res) => {
  try {
    const result = await eventsCollection
      .find({
        eventDate: { $gt: new Date().toISOString() },
      })
      .sort({ eventDate: 1 })
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to get events!",
    });
  }
});

// Get Signle event
app.get("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const result = await eventsCollection.findOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

// Create Event
app.post("/api/events", verifyToken, async (req, res) => {
  const data = req.body;
  data.createdBy = req.user.email.toLowerCase();
  data.createdAt = new Date().toISOString();
  const result = await eventsCollection.insertOne(data);
  res.send(result);
});

// Join Event
app.post("/api/events/:id/join", verifyToken, async (req, res) => {
  const { id } = req.params;
  const email = req.user.email.toLowerCase();
  const event = await eventsCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!event) {
    return res.status(404).send({ message: "Event not found!" });
  }

  const alreadyJoined = await joinedEventsCollection.findOne({
    eventId: id,
    email,
  });
  if (alreadyJoined) {
    return res.status(400).send({
      message: "You have already joined this event!",
    });
  }

  const data = {
    eventId: id,
    eventTitle: event.title,
    userId: req.user.sub || email,
    email,
    joinedAt: new Date().toISOString(),
  };
  const result = await joinedEventsCollection.insertOne(data);
  res.send(result);
});
// Get my events by email
app.get("/api/my-events/:email", verifyToken, async (req, res) => {
  const { email } = req.params;

  const result = await eventsCollection
    .find({
      createdBy: email.toLowerCase(),
    })
    .toArray();
  res.send(result);
});

// Get my joined events
app.get("/api/my-joined-events", verifyToken, async (req, res) => {
  const email = req.user.email.toLowerCase();
  const result = await joinedEventsCollection.aggregate([
    { $match: { email } },
    {
      $addFields: {
        eventObjectId: {
          $toObjectId: "$eventId",
        },
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "eventObjectId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 1,
        eventId: 1,
        eventTitle: 1,
        email: 1,
        userId: 1,
        joinedAt: 1,
        title: "$event.title",
        description: "$event.description",
        eventType: "$event.eventType",
        eventDate: "$event.eventDate",
        location: "$event.location",
        imageUrl: "$event.imageUrl",
      },
    },
  ]);
});

app.listen(port, () => {
  console.log(`Impactora API running on port ${port}`);
});

export default app;
