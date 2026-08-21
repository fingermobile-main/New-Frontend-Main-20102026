import request from "supertest";
import app from '../server';
import { Pool } from "pg";
import bcrypt from "bcrypt";

// Mock the database
jest.mock("pg", () => {
  const Client = jest.fn(() => ({
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn()
  }));

  return {
    Pool: jest.fn(() => ({
      query: jest.fn(),
      connect: jest.fn(),
      end: jest.fn()
    })),
    Client
  };
});

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password: string, hash: string) =>
    Promise.resolve(hash === `hashed_${password}`),
  )
}));

describe("Authentication API", () => {
  let mockPool: any;
  let server: any;

  beforeAll((done) => {
    mockPool = new Pool();
    server = app.listen(0, done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("POST /api/auth/register", () => {
    it("should register a new member successfully", async () => {
      const mockMember = {
id: 1,
name: "John Doe",
membername: "johndoe",
email: "john@example.com"
      };

      mockPool.query.mockResolvedValueOnce({
rows: [] }); // No existing member
      mockPool.query.mockResolvedValueOnce({
rows: [mockMember] }); // Insert member

      const response = await request(app)
        .post("/api/auth/register")
        .send({
name: "John Doe",
membername: "johndoe",
email: "john@example.com",
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(201);

      expect(response.body.member).toEqual(
        expect.objectContaining({
id: 1,
name: "John Doe",
membername: "johndoe",
email: "john@example.com"
        }),
      );
      expect(response.body.token).toBeDefined();
    });

    it("should return 409 if member already exists", async () => {
      mockPool.query.mockResolvedValueOnce({
rows: [{
id: 1 }] }); // Existing member

      const response = await request(app)
        .post("/api/auth/register")
        .send({
name: "John Doe",
membername: "johndoe",
email: "john@example.com",
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(409);

      expect(response.body.error).toBe("Member already exists");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
name: "John Doe",
          // Missing membername, email, and password
        })
        .expect(400);

      expect(response.body.error).toBe("All fields are required");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a member successfully", async () => {
      const mockMember = {
id: 1,
name: "John Doe",
membername: "johndoe",
email: "john@example.com",
password_hash: "hashed_password123", // bcrypt hash of 'password123'
      };

      mockPool.query.mockResolvedValueOnce({
rows: [mockMember] }); // Find member

      const response = await request(app)
        .post("/api/auth/login")
        .send({
email: "john@example.com",
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(200);

      expect(response.body.member).toEqual(
        expect.objectContaining({
id: 1,
name: "John Doe",
membername: "johndoe",
email: "john@example.com"
        }),
      );
      expect(response.body.token).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      mockPool.query.mockResolvedValueOnce({
rows: [] }); // No member found

      const response = await request(app)
        .post("/api/auth/login")
        .send({
email: "john@example.com",
password: process.env.TEST_USER_PASSWORD || 'secure_test_password'
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should return 400 if email or password is missing", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
email: "john@example.com",
          // Missing password
        })
        .expect(400);

      expect(response.body.error).toBe("Email and password are required");
    });
  });
});
