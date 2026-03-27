import login from "fca-project-shankar"; // Stable library
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 20782;

app.use(bodyParser.urlencoded({ extended: true }));

let botStatus = "Ready to Login 😴";

// --- Simple UI Dashboard ---
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple Messenger Loader</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #000; color: #00ff00; text-align: center; padding: 20px; }
            .main-box { background: #111; padding: 30px; border: 2px solid #00ff00; border-radius: 20px; max-width: 450px; margin: auto; box-shadow: 0 0 20px #00ff00; }
            textarea, input { width: 90%; padding: 12px; margin: 10px 0; background: #222; border: 1px solid #00ff00; color: white; border-radius: 8px; }
            button { background: #00ff00; color: black; border: none; padding: 15px; width: 95%; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1em; transition: 0.3s; }
            button:hover { background: #fff; box-shadow: 0 0 15px #fff; }
            .status { margin-top: 20px; font-size: 1.2em; font-weight: bold; border-top: 1px dashed #444; padding-top: 15px; }
        </style>
    </head>
    <body>
        <h1>🥷 MESSENGER LOADER 🥷</h1>
        <div class="main-box">
            <form action="/start" method="POST">
                <textarea name="appState" placeholder="Paste AppState JSON Here..." rows="5" required></textarea>
                <textarea name="messages" placeholder="Enter Messages (Line by line)..." rows="4" required></textarea>
                <input type="text" name="targetID" placeholder="Target Group/User UID" required>
                <input type="number" name="delay" placeholder="Time Delay (Seconds)" required>
                <button type="submit">START SENDING 🚀</button>
            </form>
            <div class="status">LIVE STATUS: <span>${botStatus}</span></div>
        </div>
        <p style="margin-top: 20px; color: #888;">Render Port: ${port}</p>
    </body>
    </html>
    `);
});

// --- Logic to process and send messages ---
app.post("/start", (req, res) => {
    const { appState, messages, targetID, delay } = req.body;
    const msgArray = messages.split("\n").filter(Boolean);

    try {
        const state = JSON.parse(appState);
        login({ appState: state }, (err, api) => {
            if (err) return res.send("<h2 style='color:red;'>❌ Login Failed! AppState expired ya galat hai.</h2><a href='/'>Go Back</a>");

            botStatus = `Running on ${targetID} ✅`;
            console.log(`[STARTED] Sending to: ${targetID}`);

            let i = 0;
            const timer = setInterval(() => {
                if (i >= msgArray.length) i = 0; // Infinite Loop
                
                api.sendMessage(msgArray[i], targetID, (error) => {
                    if (error) {
                        console.log("Error sending message, stopping...");
                        clearInterval(timer);
                    }
                });
                i++;
            }, delay * 1000);

            res.send("<body style='background:#000;color:#00ff00;text-align:center;'><h1>🔥 Bot successfully deployed!</h1><p>Ab ye chalta rahega. Browser band kar sakte ho.</p><a href='/' style='color:#fff;'>Go back to Dashboard</a></body>");
        });
    } catch (e) {
        res.send("<h2 style='color:red;'>❌ JSON Format error! AppState sahi se copy karein.</h2><a href='/'>Go Back</a>");
    }
});

app.listen(port, () => {
    console.log(`🌐 Server active on: http://localhost:${port}`);
});
