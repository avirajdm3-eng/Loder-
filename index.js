const login = require("fca-project-shankar");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 20782;

app.use(bodyParser.urlencoded({ extended: true }));

let botStatus = "Ready to Login 😴";

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Messenger Loader</title>
        <style>
            body { font-family: sans-serif; background: #000; color: #00ff00; text-align: center; padding: 20px; }
            .box { background: #111; padding: 20px; border: 1px solid #00ff00; border-radius: 10px; max-width: 400px; margin: auto; }
            textarea, input { width: 90%; padding: 10px; margin: 10px 0; background: #222; border: 1px solid #00ff00; color: white; }
            button { background: #00ff00; color: black; border: none; padding: 15px; width: 95%; cursor: pointer; font-weight: bold; }
        </style>
    </head>
    <body>
        <h1>🥷 LOADER DASHBOARD 🥷</h1>
        <div class="box">
            <form action="/start" method="POST">
                <textarea name="appState" placeholder="Paste AppState JSON..." rows="5" required></textarea>
                <textarea name="messages" placeholder="Messages (line by line)..." rows="4" required></textarea>
                <input type="text" name="targetID" placeholder="Target UID" required>
                <input type="number" name="delay" placeholder="Time (Seconds)" required>
                <button type="submit">START BOT</button>
            </form>
            <div style="margin-top:15px;">STATUS: ${botStatus}</div>
        </div>
    </body>
    </html>
    `);
});

app.post("/start", (req, res) => {
    const { appState, messages, targetID, delay } = req.body;
    const msgArray = messages.split("\n").filter(Boolean);

    try {
        login({ appState: JSON.parse(appState) }, (err, api) => {
            if (err) return res.send("❌ Login Failed!");
            botStatus = `Running on ${targetID} ✅`;
            let i = 0;
            setInterval(() => {
                if (i >= msgArray.length) i = 0;
                api.sendMessage(msgArray[i], targetID);
                i++;
            }, delay * 1000);
            res.send("<h1>Bot Started! Check Messenger.</h1><a href='/'>Back</a>");
        });
    } catch (e) { res.send("❌ JSON Error!"); }
});

app.listen(port, () => console.log(`Server on ${port}`));

