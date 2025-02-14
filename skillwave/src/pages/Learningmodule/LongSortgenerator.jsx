import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";  // Import jsPDF
import Header from "../../component/Header";  // Corrected path
import Footer from "../../component/Footer";  // Corrected path
import "../../assets/css/LongSortgenerator.css";
const LongShortGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState("long");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerateAnswers = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
  
    setLoading(true);
    setIsGenerated(false);
  
    const data = {
      topic: topic,
      numQuestions: numQuestions,
      questionType: questionType,
    };
  
    console.log("Sending data to backend:", data); // Log the payload
  
    try {
      const response = await axios.post("http://localhost:5000/generate-long-short-answers", data);
      console.log("Response from backend:", response.data); // Log the response
      setAnswers(response.data.questions);
      setIsGenerated(true);
    } catch (error) {
      console.error("Error generating answers:", error);
      alert("Failed to generate answers. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const margin = 10;
    const lineHeight = 10;
    const maxWidth = 180;

    doc.text(`Topic: ${topic}`, margin, 10);

    let yPosition = 20;

    answers.forEach((answer, index) => {
      const questionText = `Q${index + 1}: ${answer.question}`;
      const answerText = `A: ${answer.answer}`;

      const questionLines = doc.splitTextToSize(questionText, maxWidth);
      const answerLines = doc.splitTextToSize(answerText, maxWidth);

      doc.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * lineHeight;

      doc.text(answerLines, margin, yPosition);
      yPosition += answerLines.length * lineHeight;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`Generated_Answers_${topic}.pdf`);
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

        <div className="input-group">
          <input
            type="number"
            min="1"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            placeholder="Enter Number of Questions"
          />
        </div>

        <div className="input-group">
          <label htmlFor="questionType">Question Type:</label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="long">Long Answer</option>
            <option value="short">Short Answer</option>
          </select>
        </div>

        <button className="generate-button" onClick={handleGenerateAnswers} disabled={loading}>
          {loading ? "Generating..." : "Generate Answers"}
        </button>

        <div className="answer-list">
          {answers.length > 0 &&
            answers.map((answer, index) => (
              <div className="answer-item" key={index}>
                <p><strong>Question:</strong> {answer.question}</p>
                <p><strong>Answer:</strong> {answer.answer}</p>
              </div>
            ))}
        </div>

        {isGenerated && (
          <div className="download-pdf-container">
            <button className="download-pdf-button" onClick={generatePDF}>
              Download PDF
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LongShortGenerator;