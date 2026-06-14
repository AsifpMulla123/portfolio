import mongoose from "mongoose";

// ─── Why we cache the connection ─────────────────────────────────────────────
//
// Problem 1 — Dev hot reloads:
//   Next.js reloads modules on every file save. Without caching, each reload
//   would open a brand-new MongoDB connection, quickly exhausting the M0
//   free tier's connection limit (which is shared across all users on the cluster).
//
// Problem 2 — Serverless cold starts:
//   In production (Vercel), each API route can spin up in a new serverless
//   function instance. These instances don't share memory. Without the global
//   cache, every function invocation would open a new connection.
//
// Solution:
//   We store the connection promise on `global.mongoose` so it survives
//   hot reloads in dev and can be reused across same-instance invocations in prod.
// ─────────────────────────────────────────────────────────────────────────────

if (!process.env.MONGODB_URI) {
  // Fail loudly at startup — a missing URI means every DB call will fail anyway
  throw new Error(
    "MONGODB_URI is not defined. Add it to your .env.local file.\n" +
      "Example: MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio",
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

// Use global to persist across hot reloads in development
// In production this is just a module-level singleton
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null, // The active Mongoose connection (or null if not yet connected)
    promise: null, // The in-flight connection promise (prevents duplicate connections)
  };
}

async function connectDB() {
  // If we already have a live connection, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already in progress, wait for it instead of starting another
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Keep pool small — M0 free tier has a shared connection limit
      // Raising this too high causes "MongoServerError: too many open connections"
      maxPoolSize: 5,

      // Don't buffer Mongoose commands if the connection drops
      // We'd rather get a clear error than silent hangs
      bufferCommands: false,

      // Give up trying to find a server after 5 seconds
      // Surfaces connection issues quickly instead of hanging the request
      serverSelectionTimeoutMS: 5000,

      // How long a socket can be idle before it's closed
      // 45s is enough for slow aggregation queries without wasting connections
      socketTimeoutMS: 45000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the failed promise so the next call tries again from scratch
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
