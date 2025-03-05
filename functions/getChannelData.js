exports.handler = async function(event, context) {
    const { channelname } = event.queryStringParameters;

    if (!channelname) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Channel name is required" })
        };
    }

    // In-memory data for channels (simulate)
    let channels = {
        "@testuser": {
            channelname: "@testuser",
            subscribers: 100,
            isverified: false,
            profilepicture: "libr/img/testimg.jpg",
            videos: [
                {
                    id: 1,
                    title: "SML Movie: Snow Day",
                    description: "Junior, Joseph, Cody, and Jeffy have a snow day! \n https://smlmerch.com",
                    thumbnail: "libr/img/test.jpg"
                }
            ]
        }
    };

    const channel = channels[channelname];

    if (!channel) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Channel not found" })
        };
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow all origins for CORS
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify(channel)
    };
};
