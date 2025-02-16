const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv=require("dotenv");
const app = express();
dotenv.config();
const port=process.env.PORT || 3000


// Middleware
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // Change based on frontend port
    credentials: true,
  })
);

//connect db
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

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
const bcrypt = require("bcrypt");
const jwtSecret=process.env.JWT_SECRET

app.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
      res.status(200).json({ message: "Login successful!", token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

//contextlength kese 


app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);

  next();
});
console.log("Gemini API URL:", process.env.GEMINI_API_URL); // Debugging
console.log("Gemini API Key:", process.env.GEMINI_API_KEY); // Debugging
app.post("/generate-mcqs", async (req, res) => {
  const { topic, numMCQs } = req.body;

  // Validate input
  if (!topic || !numMCQs) {
    return res.status(400).json({ error: "Topic and number of MCQs are required." });
  }

  try {
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

    console.log("Sending payload to Gemini API:", payload); // Debugging

    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Gemini API Response:", response.data); // Debugging

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Generated Text:", generatedText); // Debugging

    let mcqs;

    try {
      const jsonStartIndex = generatedText.indexOf("[");
      const jsonEndIndex = generatedText.lastIndexOf("]") + 1;
      const jsonString = generatedText.slice(jsonStartIndex, jsonEndIndex);

      mcqs = JSON.parse(jsonString);
      if (!Array.isArray(mcqs)) {
        throw new Error("Generated MCQs are not in the expected format.");
      }
    } catch (error) {
      console.error("Error parsing generated MCQs:", error);
      return res.status(500).json({ error: "Failed to parse generated MCQs." });
    }

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
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
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
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
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
      // Sanitize the JSON string by removing invalid characters
      const sanitizedText = generatedText
        .replace(/[\u0000-\u001F]/g, "") // Remove control characters
        .replace(/\\n/g, "") // Remove escaped newlines
        .replace(/\\t/g, ""); // Remove escaped tabs

      // Extract JSON array using regex
      const jsonMatch = sanitizedText.match(/\[.*\]/s); // Match everything between the first "[" and last "]"
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});