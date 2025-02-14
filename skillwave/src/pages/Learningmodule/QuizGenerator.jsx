import React, { useState } from "react";
import axios from "axios";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { jsPDF } from "jspdf";
import "../../assets/css/QuizGenerator.css";

const QuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);

    const data = {
      topic: topic,
      numQuestions: numQuestions,
    };

    console.log("Sending data:", data);

    try {
      const response = await axios.post("http://localhost:5000/generate-quiz", data);
      console.log("Generated Quiz:", response.data);
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Quiz for the Topic: ${topic}`, 10, 10);

    let yPosition = 20;
    const margin = 10;
    const lineHeight = 8;

    quiz.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(`Question ${index + 1}: ${item.question}`, 10, yPosition);
      yPosition += lineHeight;

      item.options.forEach((option, idx) => {
        doc.text(`${String.fromCharCode(65 + idx)}. ${option}`, 10, yPosition);
        yPosition += lineHeight;
      });

      doc.text(`Answer: ${item.answer}`, 10, yPosition);
      yPosition += lineHeight;

      doc.text(`Explanation: ${item.explanation}`, 10, yPosition);
      yPosition += lineHeight;
    });

    doc.save(`${topic}_Quiz.pdf`);
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
        <input
          type="number"
          placeholder="Number of Questions (1-200)"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
          min="1"
          max="200"
        />
        <button className="generate-button" onClick={handleGenerateQuiz} disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>

        <div className="quiz-list">
          {quiz.length > 0 &&
            quiz.map((item, index) => (
              <div className="quiz-item" key={index}>
                <p><strong>Question {index + 1}:</strong> {item.question}</p>
                <ul>
                  {item.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
                <strong>Answer: {item.answer}</strong>
                <p><em>Explanation: {item.explanation}</em></p>
              </div>
            ))}
        </div>

        {quiz.length > 0 && (
          <button className="download-button" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuizGenerator;