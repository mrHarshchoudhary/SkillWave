import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";
import "../assets/css/Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
        <p className="dashboard-description">
          Manage your learning modules, track your progress, and explore new features.
        </p>
        <div className="dashboard-cards">
          <div className="card">
            <h2>MCQ Generation</h2>
            <p>Generate topic-specific multiple-choice questions to test your knowledge.</p>
            <button className="card-button">Start MCQs</button>
          </div>
          <div className="card">
            <h2>Quiz Generator</h2>
            <p>Create personalized quizzes to evaluate your learning progress.</p>
            <button className="card-button">Start Quiz</button>
          </div>
          <div className="card">
            <h2>Mock Interviews</h2>
            <p>Practice for your interviews with real-time feedback and insights.</p>
            <button className="card-button">Start Mock Interview</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
