const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

// Initialize the DynamoDB Client
const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Fleet of available unicorns
const fleet = [
    { Name: 'Bucephalus', Color: 'Golden', Gender: 'Male' },
    { Name: 'Shadowfax', Color: 'White', Gender: 'Male' },
    { Name: 'Rarity', Color: 'Purple', Gender: 'Female' },
];

exports.handler = async (event) => {
    // 1. Log the incoming event (Helpful for CloudWatch debugging)
    console.log('Received event:', JSON.stringify(event, null, 2));

    // 2. Check if the user is authorized (via Cognito)
    if (!event.requestContext.authorizer) {
        return errorResponse('Authorization not configured', 500);
    }

    const rideId = crypto.randomBytes(16).toString('hex');
    const username = event.requestContext.authorizer.claims['cognito:username'];
    
    // 3. Parse the request body (Pickup Location)
    const requestBody = JSON.parse(event.body);
    const pickupLocation = requestBody.PickupLocation;

    // 4. Dispatch a random unicorn from our fleet
    const unicorn = fleet[Math.floor(Math.random() * fleet.length)];

    try {
        // 5. Save the ride details to DynamoDB
        await ddbDocClient.send(new PutCommand({
            TableName: 'Rides',
            Item: {
                RideId: rideId,
                User: username,
                Unicorn: unicorn,
                UnicornName: unicorn.Name,
                RequestTime: new Date().toISOString(),
                PickupLocation: pickupLocation,
            },
        }));

        // 6. Return successful response
        return {
            statusCode: 201,
            body: JSON.stringify({
                RideId: rideId,
                Unicorn: unicorn,
                Eta: '30 seconds',
                Rider: username,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, 500);
    }
};

function errorResponse(errorMessage, statusCode) {
    return {
        statusCode: statusCode,
        body: JSON.stringify({ Error: errorMessage }),
        headers: { 'Access-Control-Allow-Origin': '*' },
    };
}
