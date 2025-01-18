import React, { useState } from "react";
import Header from "../../component/Header";  // Corrected path
import Footer from "../../component/Footer";  // Corrected path
import "../../assets/css/MCQgenerator.css";

const MCQGenerator = () => {
  const [topic, setTopic] = useState("");
  const [mcqs, setMcqs] = useState([]);

  const handleGenerateMCQs = () => {
    // Call the AI API or function here to generate MCQs
    const generatedMCQs = [
      { question: "What is React?", options: ["Library", "Framework", "Language", "None"], answer: "Library" },
      { question: "What is JSX?", options: ["JavaScript", "XML", "Both", "None"], answer: "Both" },
    ];
    setMcqs(generatedMCQs);
  };

  return (
    <div className="mcq-generator">
      <Header />
      <div className="mcq-generator-content">
        <h1>MCQ Generator</h1>
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="generate-button" onClick={handleGenerateMCQs}>Generate MCQs</button>

        <div className="mcq-list">
          {mcqs.length > 0 && mcqs.map((mcq, index) => (
            <div className="mcq-item" key={index}>
              <p>{mcq.question}</p>
              <ul>
                {mcq.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <strong>Answer: {mcq.answer}</strong>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MCQGenerator;
