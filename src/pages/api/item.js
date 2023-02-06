import * as uuid from "uuid";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: process.env.REGION,
});

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { Item } = await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: { S: uuid.v4() },
          content: { S: req.body.content },
        },
      })
    );

    return res.status(201).json(Item);
  }

  if (req.method === "GET") {
    if (req.query.id) {
      const { Item } = await client.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: req.query.id },
          },
        })
      );

      return res.status(200).json(Item);
    }

    const { Items } = await client.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );
    return res.status(200).json(Items);
  }

  if (req.method === "POST") {
    console.log(req.body);
    const { Attributes } = await client.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: req.body.id,
        },
        UpdateExpression:
          "set CustomerName = :n, InvoiceDate = :d, Services = :s, Paid = :p",
        ExpressionAttributeValues: {
          ":n": req.body.CustomerName,
          ":d": req.body.InvoiceDate,
          ":s": req.body.Services,
          ":p": req.body.Paid,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return res.status(200).json(Attributes);
  }

  if (req.method === "DELETE") {
    await client.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: req.body.id },
        },
      })
    );

    return res.status(204).json({});
  }
}
