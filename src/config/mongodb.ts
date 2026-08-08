import { MongoClient, ServerApiVersion } from "mongodb";
import dns from "node:dns";
import dotenv from "dotenv";
dotenv.config();

// Temporary workaround for local Windows DNS resolution issue.
// Remove this after verifying the environment or when the issue is resolved.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_DB_PASS}@cluster0.cixpn6n.mongodb.net/?appName=Cluster0`;

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
