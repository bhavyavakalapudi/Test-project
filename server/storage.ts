import { users, batchJobs, type User, type InsertUser, type BatchJob, type InsertBatchJob } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createBatchJob(batchJob: InsertBatchJob): Promise<BatchJob>;
  getBatchJobs(): Promise<BatchJob[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private batchJobs: Map<number, BatchJob>;
  private currentUserId: number;
  private currentBatchJobId: number;

  constructor() {
    this.users = new Map();
    this.batchJobs = new Map();
    this.currentUserId = 1;
    this.currentBatchJobId = 1;

    // Add default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@test.com",
      password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBatchJob(insertBatchJob: InsertBatchJob): Promise<BatchJob> {
    const id = this.currentBatchJobId++;
    const batchJob: BatchJob = {
      ...insertBatchJob,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.batchJobs.set(id, batchJob);
    return batchJob;
  }

  async getBatchJobs(): Promise<BatchJob[]> {
    return Array.from(this.batchJobs.values());
  }
}

export const storage = new MemStorage();
