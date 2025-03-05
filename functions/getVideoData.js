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
    2: {
        id: 2,
        title: "SML Movie Compilation!",
        description: "Sml movie compilation",
        likes: 30,
        dislikes: 1,
        creator: "@testuser",
        creatorProfilePic: "libr/img/testimg.jpg",
        video: "libr/videos/anothervideo.mp4",
        thumbnail: "libr/img/another_video_thumbnail.jpg"
    }
};

// Track the next available video ID
let nextVideoId = Object.keys(videos).length + 1;

// Handler function
exports.handler = async function(event, context) {
    if (event.httpMethod === "POST") {
        try {
            // Parse the incoming request body
            const { title, description, creator, video, thumbnail } = JSON.parse(event.body);

            // Check if all required fields are provided
            if (!title || !description || !creator || !video || !thumbnail) {
                console.error("Missing required fields", { title, description, creator, video, thumbnail });
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Missing required video fields" })
                };
            }

            // Create a new video object
            const newVideo = {
                id: nextVideoId++,
                title,
                description,
                creator,
                creatorProfilePic: "libr/img/default-profile.jpg", // Default profile pic
                video,
                thumbnail,
                likes: 0,
                dislikes: 0
            };

            // Store the video in-memory
            videos[newVideo.id] = newVideo;

            console.log("New video added:", newVideo);  // Debugging log

            return {
                statusCode: 201,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ success: true, video: newVideo })
            };
        } catch (error) {
            console.error("Failed to process the request", error);  // Log the error for debugging
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to process request" })
            };
        }
    }

    // Handling GET requests
    const { id, getallvideos, search } = event.queryStringParameters;

    if (getallvideos === "true") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.values(videos))
        };
    }

    if (search) {
        const query = search.toLowerCase();
        const searchResults = Object.values(videos).filter(video =>
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query)
        );
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(searchResults)
        };
    }

    // Fetch a specific video by its ID
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Video ID is required" })
        };
    }

    const videoId = parseInt(id, 10);
    const video = videos[videoId];

    if (!video) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Video not found" })
        };
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(video)
    };
};
