// In-memory data for videos and channels
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

let channels = {
    "@testuser": {
        channelname: "@testuser",
        subscribers: 100,
        isverified: false,
        profilepicture: "libr/img/testimg.jpg",
        videos: [1, 2] // References to video IDs
    }
};

// Handler for the "getChannelData" function
exports.handler = async function(event, context) {
    const { channelname } = event.queryStringParameters; // Get the channel name from the query string
    
    if (!channelname) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Channel name is required" })
        };
    }
    
    // Check if the channel exists in the in-memory data
    const channel = channels[channelname];
    
    if (!channel) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Channel not found" })
        };
    }
    
    // Get videos data for the channel
    const channelVideos = channel.videos.map(videoId => videos[videoId]);
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            channelname: channel.channelname,
            subscribers: channel.subscribers,
            isverified: channel.isverified,
            profilepicture: channel.profilepicture,
            videos: channelVideos
        })
    };
};
