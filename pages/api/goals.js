import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ca-central-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "bee-live-goals";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // GET: Retrieve all goals for user
    if (req.method === "GET") {
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ScanIndexForward: false, // Most recent first
      });

      const response = await docClient.send(command);
      return res.status(200).json({
        success: true,
        goals: response.Items || [],
        count: response.Count || 0,
      });
    }

    // POST: Create new goal
    if (req.method === "POST") {
      const { title, description, dueDate, category, priority, color } =
        req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const goalId = `goal_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const now = new Date().toISOString();

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          userId,
          goalId,
          title,
          description: description || "",
          dueDate: dueDate || null,
          category: category || "General",
          priority: priority || "Medium",
          color: color || "#3b82f6",
          completed: false,
          createdAt: now,
          updatedAt: now,
          progress: 0,
        },
      });

      await docClient.send(command);

      return res.status(201).json({
        success: true,
        message: "Goal created successfully",
        goalId,
      });
    }

    // PUT: Update existing goal
    if (req.method === "PUT") {
      const {
        goalId,
        title,
        description,
        dueDate,
        category,
        priority,
        completed,
        progress,
        color,
      } = req.body;

      if (!goalId) {
        return res.status(400).json({ error: "goalId is required" });
      }

      const updateParams = {
        TableName: TABLE_NAME,
        Key: {
          userId,
          goalId,
        },
        UpdateExpression: "SET #u = :updatedAt",
        ExpressionAttributeNames: {
          "#u": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":updatedAt": new Date().toISOString(),
        },
      };

      // Add optional fields to update
      if (title !== undefined) {
        updateParams.UpdateExpression += ", title = :title";
        updateParams.ExpressionAttributeValues[":title"] = title;
      }
      if (description !== undefined) {
        updateParams.UpdateExpression += ", #d = :description";
        updateParams.ExpressionAttributeNames["#d"] = "description";
        updateParams.ExpressionAttributeValues[":description"] = description;
      }
      if (dueDate !== undefined) {
        updateParams.UpdateExpression += ", dueDate = :dueDate";
        updateParams.ExpressionAttributeValues[":dueDate"] = dueDate;
      }
      if (category !== undefined) {
        updateParams.UpdateExpression += ", category = :category";
        updateParams.ExpressionAttributeValues[":category"] = category;
      }
      if (priority !== undefined) {
        updateParams.UpdateExpression += ", priority = :priority";
        updateParams.ExpressionAttributeValues[":priority"] = priority;
      }
      if (completed !== undefined) {
        updateParams.UpdateExpression += ", completed = :completed";
        updateParams.ExpressionAttributeValues[":completed"] = completed;
      }
      if (progress !== undefined) {
        updateParams.UpdateExpression += ", progress = :progress";
        updateParams.ExpressionAttributeValues[":progress"] = progress;
      }
      if (color !== undefined) {
        updateParams.UpdateExpression += ", #c = :color";
        updateParams.ExpressionAttributeNames["#c"] = "color";
        updateParams.ExpressionAttributeValues[":color"] = color;
      }

      const command = new UpdateCommand(updateParams);
      await docClient.send(command);

      return res.status(200).json({
        success: true,
        message: "Goal updated successfully",
      });
    }

    // DELETE: Delete goal
    if (req.method === "DELETE") {
      const { goalId } = req.body;

      if (!goalId) {
        return res.status(400).json({ error: "goalId is required" });
      }

      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          userId,
          goalId,
        },
      });

      await docClient.send(command);

      return res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);

    // Provide helpful error messages for common issues
    if (error.name === "ResourceNotFoundException") {
      return res.status(503).json({
        error: "DynamoDB table not found",
        message:
          'The DynamoDB table "bee-live-goals" has not been created yet. Please create the table to enable persistent goal storage.',
        instructions: "See GOALS_QUICKSTART.md for setup instructions",
        tableName: "bee-live-goals",
      });
    }

    if (
      error.name === "CredentialsError" ||
      error.message?.includes("credentials")
    ) {
      return res.status(503).json({
        error: "AWS credentials not configured",
        message:
          "AWS credentials are required to access DynamoDB. Configure your AWS credentials or create the DynamoDB table.",
        instructions: "Run: aws configure",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      name: error.name,
    });
  }
}
