import React, { useState } from "react";
import Header from "../../component/Header";  // Corrected path
import Footer from "../../component/Footer";  // Corrected path
import "../../assets/css/Quizgenerator.css";

const QuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);

  const handleGenerateQuiz = () => {
    // Call AI or your function to generate quiz
    const generatedQuiz = [
      { question: "What is 2+2?", options: ["3", "4", "5", "6"], answer: "4" },
      { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    ];
    setQuiz(generatedQuiz);
  };

  return (
    <div className="quiz-generator">
      <Header />
      <div className="quiz-generator-content">
        <h1>Quiz Generator</h1>
        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="generate-button" onClick={handleGenerateQuiz}>Generate Quiz</button>

        <div className="quiz-list">
          {quiz.length > 0 && quiz.map((q, index) => (
            <div className="quiz-item" key={index}>
              <p>{q.question}</p>
              <ul>
                {q.options.map((option, idx) => (
                  <li key={idx}>{option}</li>
                ))}
              </ul>
              <strong>Answer: {q.answer}</strong>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuizGenerator;
