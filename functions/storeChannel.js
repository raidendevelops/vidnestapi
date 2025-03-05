// functions/storeChannel.js
let channelData = {}; // This would be your in-memory storage or can be connected to a database

exports.handler = async function(event, context) {
    // Ensure the request is POST with the data
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }

    try {
        const channel = JSON.parse(event.body);
        const channelName = channel.channelname;

        // If the channel already exists, we simply update the data
        if (channelData[channelName]) {
            channelData[channelName].subscribers = channel.subscribers;
            channelData[channelName].isverified = channel.isverified;
            channelData[channelName].profilepicture = channel.profilepicture;
            channelData[channelName].videos = [...channelData[channelName].videos, ...channel.videos]; // Add new videos
        } else {
            // Create a new channel entry
            channelData[channelName] = {
                channelname: channel.channelname,
                subscribers: channel.subscribers || 0,
                isverified: channel.isverified || false,
                profilepicture: channel.profilepicture,
                videos: channel.videos || []
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Channel data stored/updated successfully" })
        };
    } catch (error) {
        console.error("Error storing channel data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to store channel data" })
        };
    }
};
