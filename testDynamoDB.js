const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");
require("dotenv").config(); // Ensure environment variables are loaded

// Initialize DynamoDB client
const client = new DynamoDBClient({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

// Function to list all DynamoDB tables
async function listDynamoDBTables() {
    try {
        const command = new ListTablesCommand({});
        const response = await client.send(command);
        console.log("Available DynamoDB Tables:", response.TableNames);
    } catch (err) {
        console.error("Failed to list tables:", err);
    }
}

listDynamoDBTables();

// Test Connection Function
// async function testConnection() {
//     try {
//         const data = await client.config.credentials();
//         console.log("DynamoDB Connection Successful");
//         console.log("AWS Credentials:", data);
//     } catch (err) {
//         console.error("DynamoDB Connection Failed:", err);
//     }
// }

// testConnection();
