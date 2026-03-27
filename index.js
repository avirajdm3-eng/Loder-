import login from "fca-priyansh";
import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const port = process.env.PORT || 20782;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let botStatus = "Offline 🛑";
let activeProcesses = [];

// --- UI Dashboard ---
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gemini Multi-Bot Dashboard</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #121212; color: white; padding: 20px; text-align: center; }
            .card { background: #1e1e1e; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); max-width: 400px; margin: auto; }
            input, textarea { width: 90%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none; }
            button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; }
            .status { margin-top: 20px; padding: 10px; border: 1px solid #444; border-radius: 10px; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <h2>🤖 Messenger Bot Controller</h2>
        <div class="card">
            <form action="/start" method="POST">
                <textarea name="appState" placeholder="Paste AppState JSON here..." rows="5" required></textarea>
                <textarea name="messages" placeholder="Enter messages (one per line)..." rows="3" required></textarea>
                <input type="text" name="targetID" placeholder="Target Group/User UID" required>
                <input type="number" name="delay" placeholder="Delay in seconds (e.g. 10)" required>
                <button type="submit">Deploy & Start Bot 🚀</button>
            </form>
        </div>
        <div class="status">
            <h3>Live Status: <span style="color: #00ff00;">${botStatus}</span></h3>
            <p>Ready to spam or reply automatically.</p>
        </div>
    </body>
    </html>
    `);
});

// --- Logic to start bot ---
app.post("/start", (req, res) => {
    const { appState, messages, targetID, delay } = req.body;
    const msgArray = messages.split("\n").filter(Boolean);

    try {
        login({ appState: JSON.parse(appState) }, (err, api) => {
            if (err) return res.send("❌ Login Failed! AppState check karo.");

            botStatus = `Running on ${targetID} ✅`;
            let index = 0;

            const interval = setInterval(() => {
                if (index >= msgArray.length) index = 0; // Infinite loop
                api.sendMessage(msgArray[index], targetID, (err) => {
                    if (err) console.log("Message failed to send.");
                });
                index++;
            }, delay * 1000);

            activeProcesses.push(interval);
            res.send(`<h1>Bot Started!</h1><p>Target: ${targetID}</p><a href="/">Go Back</a>`);
        });
    } catch (e) {
        res.send("❌ Invalid AppState JSON format.");
    }
});

app.listen(port, () => {
    console.log(`🌐 Dashboard running on http://localhost:${port}`);
});
