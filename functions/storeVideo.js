// functions/storeVideo.js
let videoData = []; // This would be your in-memory storage or can be connected to a database

exports.handler = async function(event, context) {
    // Ensure the request is POST with the data
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }

    try {
        const video = JSON.parse(event.body);

        // Generate a new video ID (you can replace this with a better method or auto-incrementing ID)
        const newVideoId = videoData.length + 1;

        // Add new video to the in-memory storage (or save to a database)
        videoData.push({
            id: newVideoId,
            title: video.title,
            description: video.description,
            likes: video.likes || 0,
            dislikes: video.dislikes || 0,
            creator: video.creator,
            video: video.video
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Video uploaded successfully", videoId: newVideoId })
        };
    } catch (error) {
        console.error("Error storing video:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to upload video" })
        };
    }
};
