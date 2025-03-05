// In-memory data for videos
let videos = {
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
    const newId = Object.keys(videos).length + 1;
    videos[newId] = {
        id: newId,
        title: videoData.title,
        description: videoData.description,
        likes: 0,
        dislikes: 0,
        creator: '@testuser',
        creatorProfilePic: "libr/img/testimg.jpg",
        video: videoData.video, // URL from Filestack
        thumbnail: videoData.thumbnail // URL for the thumbnail image
    };
}

// Handler for the "uploadVideo" function
exports.uploadVideo = async function(event, context) {
    const videoData = JSON.parse(event.body);

    addNewVideo(videoData);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ success: true })
    };
};

// Handler for the "getVideoData" function
exports.getVideoData = async function(event, context) {
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
