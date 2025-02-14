const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
//connect db
mongoose.connect("mongodb://localhost:27017/userDB",{
  useNewUrlParser:true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// API Endpoint for User Registration
app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const newUser = new User({ fullName, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});
// API Endpoint for User Login
// API Endpoint for User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ userId: user._id }, "harsh@121@121##", { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful!", token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});
//contextlength kese 
const GEMINI_API_KEY = "AIzaSyD3x0VzqgWDjkWpQyO9wm_66zZggPafHkg"; 
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});
app.post("/generate-mcqs", async (req, res) => {
  const { topic, numMCQs } = req.body;

  // Validate input
  if (!topic || !numMCQs) {
    return res.status(400).json({ error: "Topic and number of MCQs are required." });
  }

  try {
    // Construct the payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate ${numMCQs} unique multiple-choice questions (MCQs) about "${topic}". 
              Each question should have 4 options labeled A, B, C, and D, and one correct answer. 
              Return the questions in the following JSON format:
              [
                {
                  "question": "Question text",
                  "options": {
                    "A": "Option A",
                    "B": "Option B",
                    "C": "Option C",
                    "D": "Option D"
                  },
                  "answer": "Correct option (A, B, C, or D)"
                }
              ]`,
            },
          ],
        },
      ],
    };

    // Send the request to Gemini AI
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the generated content
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Generated Text:", generatedText); // Log the raw response

    let mcqs;

    try {
      // Extract JSON portion from the response
      const jsonStartIndex = generatedText.indexOf("[");
      const jsonEndIndex = generatedText.lastIndexOf("]") + 1;
      const jsonString = generatedText.slice(jsonStartIndex, jsonEndIndex);

      mcqs = JSON.parse(jsonString); // Parse the extracted JSON string
      if (!Array.isArray(mcqs)) {
        throw new Error("Generated MCQs are not in the expected format.");
      }
    } catch (error) {
      console.error("Error parsing generated MCQs:", error);
      return res.status(500).json({ error: "Failed to parse generated MCQs." });
    }

    // Send the generated MCQs back in the response
    res.json({ mcqs });
  } catch (error) {
    console.error("Error generating MCQs:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate MCQs. Please try again later." });
  }
});
app.post("/generate-quiz", async (req, res) => {
  const { topic, numQuestions } = req.body;

  if (!topic || !numQuestions) {
    return res.status(400).json({ error: "Topic and number of questions are required." });
  }

  try {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate ${numQuestions} quiz questions for the topic: "${topic}". 
              Each question should have 4 options labeled A, B, C, and D, one correct answer, and a brief explanation. 
              Return the questions in the following JSON format:
              [
                {
                  "question": "Question text",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "answer": "Correct option (A, B, C, or D)",
                  "explanation": "Explanation of the correct answer"
                }
              ]`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Generated Text:", generatedText);

    let quiz;

    try {
      const jsonStartIndex = generatedText.indexOf("[");
      const jsonEndIndex = generatedText.lastIndexOf("]") + 1;
      const jsonString = generatedText.slice(jsonStartIndex, jsonEndIndex);

      quiz = JSON.parse(jsonString);
      if (!Array.isArray(quiz)) {
        throw new Error("Generated quiz is not in the expected format.");
      }
    } catch (error) {
      console.error("Error parsing generated quiz:", error);
      return res.status(500).json({ error: "Failed to parse generated quiz." });
    }

    res.json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate quiz. Please try again later." });
  }
});
app.post("/generate-long-short-answers", async (req, res) => {
  const { topic, numQuestions, questionType } = req.body;

  console.log("Received request to generate long/short answers:", { topic, numQuestions, questionType });

  if (!topic || !numQuestions || !questionType) {
    console.error("Validation failed: Missing required fields");
    return res.status(400).json({ error: "Topic, number of questions, and question type are required." });
  }

  try {
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate ${numQuestions} ${questionType} answer questions for the topic: "${topic}". 
              Each question should have a detailed answer. 
              Return the questions in the following JSON format:
              [
                {
                  "question": "Question text",
                  "answer": "Detailed answer text"
                }
              ]`,
            },
          ],
        },
      ],
    };

    console.log("Sending payload to Gemini API:", payload);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Generated Text from Gemini API:", generatedText);

    let questions;

    try {
      // Extract JSON array using regex to avoid invalid text
      const jsonMatch = generatedText.match(/\[.*\]/s); // Match everything between the first "[" and last "]"
      if (!jsonMatch) {
        throw new Error("No valid JSON array found in API response.");
      }

      const jsonString = jsonMatch[0]; // Extract matched JSON array
      questions = JSON.parse(jsonString);

      if (!Array.isArray(questions)) {
        throw new Error("Generated questions are not in the expected format.");
      }
    } catch (error) {
      console.error("Error parsing generated questions:", error);
      return res.status(500).json({ error: "Failed to parse generated questions. Response might be invalid." });
    }

    console.log("Successfully generated questions:", questions);
    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate questions. Please try again later." });
  }
});

app.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, "harsh@121@121##");
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ name: user.fullName, email: user.email });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});
// Start the server
console.log(`token error`);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});