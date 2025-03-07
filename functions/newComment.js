const { MongoClient, ObjectId } = require('mongodb');

console.log('MONGO:', process.env.MONGO_URI); // Debugging line to check if the environment variable is loaded

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
let db, videosCollection;

async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            db = client.db('vidnest'); // Database name
            videosCollection = db.collection('videos'); // Collection name
            console.log('✅ Connected to MongoDB');
        } catch (error) {
            console.error('❌ MongoDB Connection Error:', error);
            throw error; // Rethrow the error so it can be caught and handled
        }
    }
}

exports.handler = async function(event) {
    console.log('Received event:', JSON.stringify(event, null, 2)); // Log the received event

    try {
        await connectDB(); // Ensure the database connection is established
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
            body: JSON.stringify({ error: 'Failed to connect to database' })
        };
    }

    if (event.httpMethod === 'POST') {
        // Handle new comment submission
        if (event.path === '/api/newComment') {
            try {
                const { videoId, message, creatorName, creatorProfile } = JSON.parse(event.body);

                if (!videoId || !message || !creatorName || !creatorProfile) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                        },
                        body: JSON.stringify({ error: 'Missing required fields' })
                    };
                }

                const commentId = new ObjectId();
                const newComment = {
                    message,
                    likes: 0,
                    dislikes: 0,
                    creatorname: creatorName,
                    dateCreated: new Date(),
                    creatorprofile: creatorProfile
                };

                const result = await videosCollection.updateOne(
                    { _id: new ObjectId(videoId) },
                    { $set: { [`comments.${commentId}`]: newComment } }
                );

                return {
                    statusCode: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ success: true, commentId, comment: newComment })
                };
            } catch (error) {
                console.error('Error adding comment:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ error: 'Failed to add comment' })
                };
            }
        }
    }

    return {
        statusCode: 405,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
