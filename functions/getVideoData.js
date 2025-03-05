// videos.js

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

// Add a new video to the in-memory data
function addNewVideo(videoData) {
    if (!videoData || !videoData.title || !videoData.description || !videoData.video || !videoData.thumbnail) {
        console.log("Invalid video data");
        return false;
    }
    const newId = Object.keys(videos).length + 1;
    videos[newId] = {
        id: newId,
        title: videoData.title,
        description: videoData.description,
        likes: 0,
        dislikes: 0,
        creator: '@testuser',
        creatorProfilePic: "libr/img/testimg.jpg",
        video: videoData.video,
        thumbnail: videoData.thumbnail
    };
    return true;
}

// Handler for the "uploadVideo" function
exports.uploadVideo = async function(event, context) {
    try {
        const videoData = JSON.parse(event.body);
        if (addNewVideo(videoData)) {
            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ success: true })
            };
        } else {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ success: false, error: "Invalid video data" })
            };
        }
    } catch (error) {
        console.error("Error processing upload:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ success: false, error: "Internal server error" })
        };
    }
};
exports.uploadVideo.handler = exports.uploadVideo;

// Handler for the "getVideoData" function
exports.getVideoData = async function(event, context) {
    const { id, getallvideos } = event.queryStringParameters;

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
exports.getVideoData.handler = exports.getVideoData;
