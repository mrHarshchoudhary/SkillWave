import React, { useState } from "react";
import Header from "../../component/Header";  // Corrected path
import Footer from "../../component/Footer";  // Corrected path
import "../../assets/css/LongSortgenerator.css";

const LongShortGenerator = () => {
  const [topic, setTopic] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleGenerateAnswers = () => {
    // Call AI to generate long/short answers
    const generatedAnswers = [
      { question: "Explain the process of photosynthesis.", answer: "Photosynthesis is the process by which plants make food using sunlight, carbon dioxide, and water." },
      { question: "What is machine learning?", answer: "Machine learning is a branch of artificial intelligence that involves the development of algorithms that allow computers to learn from and make decisions based on data." },
    ];
    setAnswers(generatedAnswers);
  };

  return (
    <div className="long-short-answer-generator">
      <Header />
      <div className="long-short-answer-generator-content">
        <h1>Long/Short Answer Generator</h1>
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="generate-button" onClick={handleGenerateAnswers}>Generate Answers</button>

        <div className="answer-list">
          {answers.length > 0 && answers.map((answer, index) => (
            <div className="answer-item" key={index}>
              <p><strong>Question:</strong> {answer.question}</p>
              <p><strong>Answer:</strong> {answer.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LongShortGenerator;
