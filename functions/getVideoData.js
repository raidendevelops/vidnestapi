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
        // New Video
        if (event.path === '/newVideo') {
            try {
                const { title, description, creator, video, thumbnail } = JSON.parse(event.body);

                if (!title || !description || !creator || !video || !thumbnail) {
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

                const newVideo = {
                    title,
                    description,
                    creator,
                    creatorProfilePic: 'libr/img/default-profile.jpg',
                    video,
                    thumbnail,
                    likes: 0,
                    dislikes: 0,
                    createdAt: new Date(),
                    comments: {}
                };

                const result = await videosCollection.insertOne(newVideo);

                return {
                    statusCode: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ success: true, video: { ...newVideo, id: result.insertedId }, id: result.insertedId })
                };
            } catch (error) {
                console.error('Error adding video:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ error: 'Failed to add video' })
                };
            }
        }

        // New Comment
        if (event.path === '/newComment') {
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

    if (event.httpMethod === 'GET') {
        const { id, getallvideos, search } = event.queryStringParameters;

        if (getallvideos === 'true') {
            try {
                const allVideos = await videosCollection.find({}).toArray();
                console.log('Fetched all videos:', JSON.stringify(allVideos, null, 2)); // Log the fetched videos

                const formattedVideos = allVideos.map(video => ({
                    ...video,
                    id: video._id,
                    _id: undefined
                }));
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify(formattedVideos)
                };
            } catch (error) {
                console.error('Error fetching all videos:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ error: 'Failed to fetch videos' })
                };
            }
        }

        if (search) {
            try {
                const query = search.toLowerCase();
                const searchResults = await videosCollection.find({
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }).toArray();
                console.log('Search results:', JSON.stringify(searchResults, null, 2)); // Log the search results

                const formattedResults = searchResults.map(video => ({
                    ...video,
                    id: video._id,
                    _id: undefined
                }));
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify(formattedResults)
                };
            } catch (error) {
                console.error('Error searching videos:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify({ error: 'Failed to search videos' })
                };
            }
        }

        if (id) {
            try {
                const video = await videosCollection.findOne({ _id: new ObjectId(id) });
                if (!video) {
                    return {
                        statusCode: 404,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                        },
                        body: JSON.stringify({ error: 'Video not found' })
                    };
                }
                console.log('Fetched video by ID:', JSON.stringify(video, null, 2)); // Log the fetched video

                const formattedVideo = {
                    ...video,
                    id: video._id,
                    _id: undefined
                };
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    body: JSON.stringify(formattedVideo)
                };
            } catch (error) {
                console.error('Error fetching video by ID:', error);
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
                    },
                    body: JSON.stringify({ error: 'Failed to fetch video' })
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
