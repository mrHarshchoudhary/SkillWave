import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header"; // Import Header (make sure this path i
import Footer from "./component/Footer"; 
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LongShortGenerator from "./pages/Learningmodule/LongSortgenerator";
import MCQGenerator from "./pages/Learningmodule/MCQgenerator";
import QuizGenerator from "./pages/Learningmodule/QuizGenerator";
import SignIn from "./pages/Signin";


function App() {
 

  return (
  <div>
 <Router>
      {/* <Header />  */}
      <Routes>
        {/* Define routes for each page */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning-modules/mcq-generator" element={<MCQGenerator />} />
        <Route path="/learning-modules/quiz-generator" element={<QuizGenerator />} />
        <Route path="/learning-modules/long-short-answer" element={<LongShortGenerator />} />
        {/* <Route path="/mock-interview" element={<MockInterview />} /> */}
      </Routes>
      {/* <Footer />  */}
    </Router>
  </div>
  )
}

export default App;
