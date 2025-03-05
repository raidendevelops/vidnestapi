// In-memory data for videos
let videos = {
    1: {
        id: 1,
        title: "Example Video",
        description: "This is an example video description.",
        likes: 120,
        dislikes: 4,
        creator: "@testuser",
        creatorProfilePic: "https://via.placeholder.com/40",
        video: "libr/videos/examplevideo.mp4",
        thumbnail: "libr/img/video_thumbnail.jpg"
    },
    2: {
        id: 2,
        title: "Another Video",
        description: "Another example video.",
        likes: 30,
        dislikes: 1,
        creator: "@testuser",
        creatorProfilePic: "https://via.placeholder.com/40",
        video: "libr/videos/anothervideo.mp4",
        thumbnail: "libr/img/another_video_thumbnail.jpg"
    }
};

// Handler for the "getVideoData" function
exports.handler = async function(event, context) {
    const { id, getallvideos } = event.queryStringParameters; // Get video ID or 'getallvideos' parameter
    
    // If 'getallvideos=true' parameter is provided, return all videos
    if (getallvideos === 'true') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.values(videos))
        };
    }

    // Handle individual video fetch
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Video ID is required" })
        };
    }

    const videoId = parseInt(id, 10);

    // Check if the video exists in the in-memory data
    const video = videos[videoId];
    
    if (!video) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Video not found" })
        };
    }

    // Return video data along with CORS headers
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(video)
    };
};
