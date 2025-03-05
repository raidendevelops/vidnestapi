// In-memory data for videos
let videos = {
    1: {
        title: "Example Video",
        description: "This is an example video description.",
        likes: 120,
        dislikes: 4,
        creator: "@testuser",
        video: "libr/videos/examplevideo.mp4",
        thumbnail: "libr/img/video_thumbnail.jpg"
    },
    2: {
        title: "Another Video",
        description: "Another example video.",
        likes: 30,
        dislikes: 1,
        creator: "@testuser",
        video: "libr/videos/anothervideo.mp4",
        thumbnail: "libr/img/another_video_thumbnail.jpg"
    }
};

// Handler for the "getVideoData" function
exports.handler = async function(event, context) {
    const { id } = event.queryStringParameters; // Get the video ID from the query string
    
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Video ID is required" })
        };
    }

    // Convert id to number (assuming video ID is an integer)
    const videoId = parseInt(id, 10);

    // Check if the video exists in the in-memory data
    const video = videos[videoId];
    
    if (!video) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Video not found" })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(video)
    };
};
