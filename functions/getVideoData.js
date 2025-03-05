// getvideodata.js

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

// Handler for the "getVideoData" function
exports.handler = async function(event, context) { // Corrected export
    const { id, getallvideos, search } = event.queryStringParameters;

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
