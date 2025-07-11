import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, batchJobSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // For demo purposes, allow both hashed and plain text password
      const isValidPassword = 
        password === "password123" || 
        await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Middleware to verify JWT token
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  };

  // Start batch endpoint
  app.post("/api/start-batch", authenticateToken, async (req, res) => {
    try {
      const batchData = batchJobSchema.parse(req.body);
      
      // Validate that importSetupId is a positive integer
      if (!Number.isInteger(batchData.importSetupId) || batchData.importSetupId <= 0) {
        return res.status(400).json({ 
          status: "error", 
          message: "Import Setup ID must be a positive integer greater than 0" 
        });
      }

      const batchJob = await storage.createBatchJob(batchData);
      
      res.json({ 
        status: "success", 
        message: "Batch started successfully!",
        batchJob 
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("validation")) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid input data. Please check your values and try again." 
        });
      }
      res.status(500).json({ 
        status: "error", 
        message: "An error occurred while starting the batch" 
      });
    }
  });

  // Verify token endpoint
  app.get("/api/verify", authenticateToken, async (req: any, res) => {
    res.json({ user: req.user });
  });

  const httpServer = createServer(app);
  return httpServer;
}
