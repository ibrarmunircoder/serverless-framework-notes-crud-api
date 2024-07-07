const {
  PutItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const { NodeHttpHandler } = require('@smithy/node-http-handler');

const ddbClient = new DynamoDBClient({
  region: 'us-east-1',
  maxAttempts: 3,
  requestHandler: new NodeHttpHandler({
    requestTimeout: 5000,
  }),
});
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
};

exports.createNote = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const command = new PutItemCommand({
      TableName: NOTES_TABLE_NAME,
      Item: marshall({
        notesId: body.id,
        title: body.title,
        body: body.body,
      }),
      ConditionExpression: 'attribute_not_exists(notesId)',
    });

    await ddbClient.send(command);
    return send(201, {
      message: 'A New Note created successfully!',
    });
  } catch (error) {
    console.error(error);
    return send(500, error.message);
  }
};

exports.updateNote = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const notesId = event.pathParameters.id;
    const command = new UpdateItemCommand({
      TableName: NOTES_TABLE_NAME,
      Key: marshall({ notesId }),
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body',
      },
      ExpressionAttributeValues: marshall({
        ':title': data.title,
        ':body': data.body,
      }),
    });

    await ddbClient.send(command);
    return send(200, {
      message: `The note with id ${notesId} has been updated successfully!`,
    });
  } catch (error) {
    console.error(error);
    return send(500, error.message);
  }
};

exports.deleteNote = async (event) => {
  try {
    const notesId = event.pathParameters.id;
    await ddbClient.send(
      new DeleteItemCommand({
        TableName: NOTES_TABLE_NAME,
        Key: marshall({ notesId }),
      })
    );
    return send(200, {
      message: `The note with id ${notesId} has been deleted successfully!`,
    });
  } catch (error) {
    console.error(error);
    return send(500, error.message);
  }
};
exports.getAllNotes = async (event) => {
  try {
    const data = await ddbClient.send(
      new ScanCommand({
        TableName: NOTES_TABLE_NAME,
      })
    );
    return send(200, data);
  } catch (error) {
    console.error(error);
    return send(500, error.message);
  }
};
