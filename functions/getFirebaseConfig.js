// functions/firebaseConfig.js
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow all origins for simplicity
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify({
      apiKey: "AIzaSyDB62nrHImK7t7iAzQc0PFdes4xkzxQ5Yg",
      authDomain: "vidnest-88513.firebaseapp.com",
      projectId: "vidnest-88513",
      storageBucket: "vidnest-88513.firebasestorage.app",
      messagingSenderId: "87304389674",
      appId: "1:87304389674:web:1f79a5b412a44147deef53",
      measurementId: "G-NM2VX9K5W1"
        })
    };
};
