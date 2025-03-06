// In-memory data for videos
const videos = {
    1: {
        id: 1,
        title: "SML Movie: Snow Day",
        description: "Junior, Joseph, Cody, and Jeffy have a snow day! \n https://smlmerch.com",
        likes: 120,
        dislikes: 4,
        creator: "@testuser",
        creatorProfilePic: "libr/img/testimg.jpg",
        video: "libr/videos/examplevideo.mp4",
        thumbnail: "libr/img/test.jpg"
    },
};

// Track the next available video ID
let nextVideoId = Object.keys(videos).length + 1;

// Handler function
exports.handler = async function(event, context) {
    console.log("Request received:", event);  // Log the incoming event (request)

    // Handle POST requests for video submission
    if (event.httpMethod === "POST") {
        try {
            // Parse the incoming request body
            const { title, description, creator, video, thumbnail } = JSON.parse(event.body);

            // Debugging log: Log the received request body
            console.log("Received POST request body:", { title, description, creator, video, thumbnail });

            // Step 1: Check if all required fields are provided
            if (!title || !description || !creator || !video || !thumbnail) {
                console.error("Missing required fields", { title, description, creator, video, thumbnail });
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Missing required video fields" })
                };
            }

            // Step 2: Create a new video object
            const newVideo = {
                id: nextVideoId++,  // Increment the ID for the new video
                title,
                description,
                creator,
                creatorProfilePic: "libr/img/default-profile.jpg",  // Default profile pic
                video,
                thumbnail,
                likes: 0,
                dislikes: 0
            };

            // Step 3: Store the video in-memory
            videos[newVideo.id] = newVideo;

            console.log("New video added:", newVideo);  // Debugging log

            // Step 4: Return a success response
            return {
                statusCode: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",  // Allow all origins
                    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",  // Allow POST and GET
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ success: true, video: newVideo })
            };
        } catch (error) {
            // Step 5: Handle any errors during the request
            console.error("Failed to process the request", error);  // Log the error for debugging
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to process request" })
            };
        }
    }

    // Handle GET requests for fetching video data

    const { id, getallvideos, search } = event.queryStringParameters;

    // Step 6: If requesting all videos
    if (getallvideos === "true") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",  // Allow POST and GET
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.values(videos))  // Return all videos
        };
    }

    // Step 7: If searching for specific videos by title or description
    if (search) {
        const query = search.toLowerCase();
        const searchResults = Object.values(videos).filter(video =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query)
        );
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",  // Allow all origins
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchResults)  // Return search results
        };
    }

    // Step 8: Fetch a specific video by its ID
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Video ID is required" })
        };
    }

    const videoId = parseInt(id, 10);
    const video = videos[videoId];

    // Step 9: If video not found
    if (!video) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Video not found" })
        };
    }

    // Step 10: Return a specific video by its ID
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",  // Allow all origins
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",  // Allow POST and GET
            "Content-Type": "application/json"
        },
        body: JSON.stringify(video)  // Return the specific video
    };
};
