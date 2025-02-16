import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import "../../assets/css/MCQgenerator.css";


const MCQGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numMCQs, setNumMCQs] = useState(1);
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite
  console.log("API Base URL:", API_BASE_URL); 

  const handleGenerateMCQs = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic.");
      return;
    }
  
    setLoading(true); // Set loading to true
  
    const data = {
      topic: topic,
      numMCQs: numMCQs,
    };
  
    console.log("Sending data:", data);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-mcqs`, data);
      console.log("Generated MCQs:", response.data);
      setMcqs(response.data.mcqs);
    } catch (error) {
      console.error("Error generating MCQs:", error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };
  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`MCQs for the Topic: ${topic}`, 10, 10);

    let yPosition = 20;
    const margin = 10; 
    const lineHeight = 8; 
    const maxLinesPerPage = 30; 

    mcqs.forEach((mcq, index) => {
    
      if (yPosition > 250) { 
        doc.addPage();
        yPosition = margin;
      }

      // Add question number
      doc.text(`Question ${index + 1}: ${mcq.question}`, 10, yPosition);
      yPosition += lineHeight;

      // Add options
      Object.entries(mcq.options).forEach(([key, value]) => {
        doc.text(`${key}. ${value}`, 10, yPosition);
        yPosition += lineHeight;
      });

      // Add answer
      doc.text(`Answer: ${mcq.answer}`, 10, yPosition);
      yPosition += lineHeight; // Add space after each question
    });

    // Save the PDF
    doc.save(`${topic}_MCQs.pdf`);
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
        <input
          type="number"
          placeholder="Number of MCQs (1-200)"
          value={numMCQs}
          onChange={(e) => setNumMCQs(parseInt(e.target.value) || 1)}
          min="1"
          max="200"
        />
        <button className="generate-button" onClick={handleGenerateMCQs} disabled={loading}>
          {loading ? "Generating..." : "Generate MCQs"}
        </button>

        <div className="mcq-list">
          {mcqs.length > 0 &&
            mcqs.map((mcq, index) => (
              <div className="mcq-item" key={index}>
                <p><strong>Question {index + 1}:</strong> {mcq.question}</p>
                <ul>
                  {Object.entries(mcq.options).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
                <strong>Answer: {mcq.answer}</strong>
              </div>
            ))}
        </div>

        {mcqs.length > 0 && (
          <button className="download-button" onClick={handleDownloadPDF}>
            Download PDF
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MCQGenerator;
