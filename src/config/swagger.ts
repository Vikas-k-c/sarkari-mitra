import swaggerJsdoc from "swagger-jsdoc";

const errorResponse = {
  description: "Request failed",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ErrorResponse" },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Sarkari Mitra API",
      version: "1.0.0",
      description:
        "REST API for Sarkari Mitra authentication and citizen profiles.",
    },
    servers: [
      {
        url: "/",
        description: "Current server",
      },
    ],
    tags: [
      { name: "Authentication", description: "User registration and login" },
      { name: "Profiles", description: "Authenticated citizen profile management" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Access token returned by register or login.",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: [
            "id",
            "fullName",
            "mobile",
            "language",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            fullName: { type: "string", example: "Amit Kumar" },
            mobile: { type: "string", pattern: "^[6-9][0-9]{9}$", example: "9876543210" },
            language: { type: "string", example: "hi" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          additionalProperties: false,
          required: ["fullName", "mobile", "password"],
          properties: {
            fullName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              example: "Amit Kumar",
            },
            mobile: {
              type: "string",
              pattern: "^[6-9][0-9]{9}$",
              example: "9876543210",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              maxLength: 72,
              example: "SecurePass123",
            },
            language: {
              type: "string",
              minLength: 2,
              maxLength: 10,
              default: "en",
              example: "hi",
            },
          },
        },
        LoginRequest: {
          type: "object",
          additionalProperties: false,
          required: ["mobile", "password"],
          properties: {
            mobile: {
              type: "string",
              pattern: "^[6-9][0-9]{9}$",
              example: "9876543210",
            },
            password: {
              type: "string",
              format: "password",
              maxLength: 72,
              example: "SecurePass123",
            },
          },
        },
        AuthenticationData: {
          type: "object",
          required: ["user", "accessToken"],
          properties: {
            user: { $ref: "#/components/schemas/User" },
            accessToken: {
              type: "string",
              description: "JWT bearer access token.",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        AuthenticationResponse: {
          allOf: [
            { $ref: "#/components/schemas/SuccessResponse" },
            {
              type: "object",
              properties: {
                data: { $ref: "#/components/schemas/AuthenticationData" },
              },
            },
          ],
        },
        Profile: {
          type: "object",
          required: [
            "id",
            "userId",
            "age",
            "gender",
            "occupation",
            "income",
            "education",
            "state",
            "district",
            "category",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            age: { type: "integer", minimum: 1, maximum: 120, example: 32 },
            gender: { type: "string", maxLength: 30, example: "male" },
            occupation: { type: "string", maxLength: 100, example: "farmer" },
            income: { type: "integer", minimum: 0, example: 240000 },
            education: { type: "string", maxLength: 100, example: "graduate" },
            state: { type: "string", maxLength: 100, example: "Uttar Pradesh" },
            district: { type: "string", maxLength: 100, example: "Lucknow" },
            category: { type: "string", maxLength: 50, example: "general" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateProfileRequest: {
          type: "object",
          additionalProperties: false,
          required: [
            "age",
            "gender",
            "occupation",
            "income",
            "education",
            "state",
            "district",
            "category",
          ],
          properties: {
            age: { type: "integer", minimum: 1, maximum: 120, example: 32 },
            gender: { type: "string", minLength: 1, maxLength: 30, example: "male" },
            occupation: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              example: "farmer",
            },
            income: { type: "integer", minimum: 0, example: 240000 },
            education: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              example: "graduate",
            },
            state: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              example: "Uttar Pradesh",
            },
            district: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              example: "Lucknow",
            },
            category: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              example: "general",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          additionalProperties: false,
          minProperties: 1,
          properties: {
            age: { type: "integer", minimum: 1, maximum: 120, example: 33 },
            gender: { type: "string", minLength: 1, maxLength: 30 },
            occupation: { type: "string", minLength: 1, maxLength: 100 },
            income: { type: "integer", minimum: 0, example: 300000 },
            education: { type: "string", minLength: 1, maxLength: 100 },
            state: { type: "string", minLength: 1, maxLength: 100 },
            district: { type: "string", minLength: 1, maxLength: 100 },
            category: { type: "string", minLength: 1, maxLength: 50 },
          },
        },
        ProfileResponse: {
          allOf: [
            { $ref: "#/components/schemas/SuccessResponse" },
            {
              type: "object",
              properties: {
                data: {
                  type: "object",
                  required: ["profile"],
                  properties: {
                    profile: { $ref: "#/components/schemas/Profile" },
                  },
                },
              },
            },
          ],
        },
        SuccessResponse: {
          type: "object",
          required: ["success", "data", "requestId", "timestamp"],
          properties: {
            success: { type: "boolean", enum: [true] },
            message: { type: "string" },
            data: { type: "object" },
            requestId: { type: "string", format: "uuid" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["success", "error", "requestId", "timestamp"],
          properties: {
            success: { type: "boolean", enum: [false] },
            error: {
              type: "object",
              required: ["code", "message"],
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Request validation failed" },
                details: { type: "object", additionalProperties: true },
              },
            },
            requestId: { type: "string", format: "uuid" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          operationId: "registerUser",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthenticationResponse" },
                },
              },
            },
            "409": errorResponse,
            "422": errorResponse,
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Authenticate a user",
          operationId: "loginUser",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthenticationResponse" },
                },
              },
            },
            "401": errorResponse,
            "422": errorResponse,
          },
        },
      },
      "/api/v1/profiles": {
        post: {
          tags: ["Profiles"],
          summary: "Create the authenticated user's profile",
          operationId: "createProfile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProfileRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Profile created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProfileResponse" },
                },
              },
            },
            "401": errorResponse,
            "409": errorResponse,
            "422": errorResponse,
          },
        },
        get: {
          tags: ["Profiles"],
          summary: "Get the authenticated user's profile",
          operationId: "getProfile",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Profile retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProfileResponse" },
                },
              },
            },
            "401": errorResponse,
            "404": errorResponse,
          },
        },
        patch: {
          tags: ["Profiles"],
          summary: "Update the authenticated user's profile",
          operationId: "updateProfile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Profile updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProfileResponse" },
                },
              },
            },
            "401": errorResponse,
            "404": errorResponse,
            "422": errorResponse,
          },
        },
      },
    },
  },
  apis: [],
});
