// api/index.js - This is Vercel's entry point
import app from '../server/index.js';

export default async (req, res) => {
  // This makes your Express app work with Vercel serverless
  return app(req, res);
};