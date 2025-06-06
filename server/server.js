import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

const MOODLE_URL = process.env.MOODLE_URL;
const TOKEN = process.env.MOODLE_TOKEN;

async function getUserInfo() {
  const res = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
    params: {
      wstoken: TOKEN,
      wsfunction: "core_webservice_get_site_info",
      moodlewsrestformat: "json",
    },
  });

  return res.data;
}

async function main() {
  try {
    const userInfo = await getUserInfo();
    const userid = userInfo.userid;
    console.log("User ID:", userid);

    const courses = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: TOKEN,
        wsfunction: "core_enrol_get_users_courses",
        userid: userid,
        moodlewsrestformat: "json",
      },
    });

    console.log("Courses:", courses.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}


main(); // Call the function

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
