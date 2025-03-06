const { MongoClient, ObjectId } = require('mongodb');

console.log('MONGO:', process.env.MONGO_URI); // Debugging line to check if the environment variable is loaded

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);
let db, videosCollection;

// Connect to the database
async function connectDB() {
    try {
        await client.connect();
        db = client.db('vidnest'); // Database name
        videosCollection = db.collection('videos'); // Collection name
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
    }
}
connectDB();

// Handler function
exports.handler = async function(event) {
    if (event.httpMethod === 'POST') {
        try {
            const { title, description, creator, video, thumbnail } = JSON.parse(event.body);

            if (!title || !description || !creator || !video || !thumbnail) {
                return {
                    statusCode: 400,
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
                createdAt: new Date()
            };

            const result = await videosCollection.insertOne(newVideo);

            return {
                statusCode: 201,
                body: JSON.stringify({ success: true, video: { ...newVideo, id: result.insertedId }, id: result.insertedId })
            };
        } catch (error) {
            console.error('Error adding video:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to add video' })
            };
        }
    }

    if (event.httpMethod === 'GET') {
        const { id, getallvideos, search } = event.queryStringParameters;

        if (getallvideos === 'true') {
            try {
                const allVideos = await videosCollection.find({}).toArray();
                const formattedVideos = allVideos.map(video => ({
                    ...video,
                    id: video._id,
                    _id: undefined
                }));
                return {
                    statusCode: 200,
                    body: JSON.stringify(formattedVideos)
                };
            } catch (error) {
                return {
                    statusCode: 500,
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
                const formattedResults = searchResults.map(video => ({
                    ...video,
                    id: video._id,
                    _id: undefined
                }));
                return {
                    statusCode: 200,
                    body: JSON.stringify(formattedResults)
                };
            } catch (error) {
                return {
                    statusCode: 500,
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
                        body: JSON.stringify({ error: 'Video not found' })
                    };
                }
                const formattedVideo = {
                    ...video,
                    id: video._id,
                    _id: undefined
                };
                return {
                    statusCode: 200,
                    body: JSON.stringify(formattedVideo)
                };
            } catch (error) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to fetch video' })
                };
            }
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};
