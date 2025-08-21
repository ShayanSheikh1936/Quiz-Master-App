import { useState, useEffect } from "react";
import { Options } from "./Options";

export function App() {
  const [mcqs, setMcqs] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0 && quizStarted && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizStarted && !showResult) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, quizStarted, showResult]);

  function handleTimeUp() {
    setSelectedAnswer("timeup");
    setTimeout(() => {
      if (currentQuestionIndex < mcqs.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }, 1500);
  }

  async function getQuizQuestions() {
    setLoading(true);
    try {
      const data = await fetch(
        "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple"
      );
      const questions = await data.json();
      setMcqs(questions.results);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(15);
      setTimerActive(true);
      setSelectedAnswer(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }

  function nextQuestion() {
    if (selectedAnswer === mcqs[currentQuestionIndex].correct_answer) {
      setScore(score + 10);
    }
    
    if (currentQuestionIndex < mcqs.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    if (selectedAnswer === mcqs[currentQuestionIndex].correct_answer) {
      setScore(score + 10);
    }
    setQuizStarted(false);
    setShowResult(true);
    setTimerActive(false);
  }

  function handleAnswer(answer) {
    if (!selectedAnswer && !showResult) {
      setSelectedAnswer(answer);
      setTimerActive(false);
    }
  }

  function restartQuiz() {
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setTimerActive(false);
  }

  const progress = mcqs.length > 0 ? ((currentQuestionIndex) / mcqs.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
            <i className="fas fa-brain mr-2"></i> QuizMaster
          </h1>
          <p className="mt-2 opacity-90">Test your knowledge with our engaging quiz</p>
        </div>

        <div className="p-6 md:p-8">
         
          {quizStarted && mcqs.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span>Question {currentQuestionIndex + 1} of {mcqs.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl">Loading questions...</p>
            </div>
          )}

          
          {!quizStarted && !showResult && !loading && (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <i className="fas fa-question-circle text-white text-6xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4">Welcome to QuizMaster!</h2>
              <p className="text-white/80 mb-8">Challenge yourself with 20 questions from various topics. Can you score 100%?</p>
              <button 
                onClick={getQuizQuestions}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Quiz <i className="fas fa-play ml-2"></i>
              </button>
            </div>
          )}

          
          {quizStarted && !loading && mcqs.length > 0 && (
            <>
              {/* Timer */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-medium">
                  Score: <span className="text-cyan-300">{score}</span>
                </div>
                <div className={`flex items-center ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`}>
                  <i className="fas fa-clock mr-2"></i>
                  <span className="font-mono">{timeLeft}s</span>
                </div>
              </div>

              
              <div className="bg-white/10 p-6 rounded-xl mb-6 shadow-md">
                <h2 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: mcqs[currentQuestionIndex]?.question }} />
              </div>

             
              <Options
                correctAnswer={mcqs[currentQuestionIndex]?.correct_answer}
                incorrectAnswers={mcqs[currentQuestionIndex]?.incorrect_answers}
                onAnswer={handleAnswer}
                selectedAnswer={selectedAnswer}
                timeUp={timeLeft === 0}
                questionId={currentQuestionIndex}
              />

              
              <div className="flex justify-end mt-8">
                <button 
                  onClick={selectedAnswer || timeLeft === 0 ? nextQuestion : undefined}
                  disabled={!selectedAnswer && timeLeft > 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-md disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex < mcqs.length - 1 ? 'Next Question' : 'Finish Quiz'} 
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </>
          )}

          
          {showResult && (
            <div className="text-center py-8">
              {score >= 100 ? (
                <div className="animate-bounce">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-trophy text-white text-5xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Excellent!</h2>
                  <p className="text-white/80 mb-4">You scored <span className="text-emerald-300 font-bold text-3xl">{score}</span> points</p>
                </div>
              ) : score >= 70 ? (
                <div className="animate-bounce">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-star text-white text-5xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
                  <p className="text-white/80 mb-4">You scored <span className="text-blue-300 font-bold text-3xl">{score}</span> points</p>
                </div>
              ) : score >= 50 ? (
                <div>
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-award text-white text-5xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Good Effort!</h2>
                  <p className="text-white/80 mb-4">You scored <span className="text-amber-300 font-bold text-3xl">{score}</span> points</p>
                </div>
              ) : (
                <div>
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-redo text-white text-5xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Keep Trying!</h2>
                  <p className="text-white/80 mb-4">You scored <span className="text-rose-300 font-bold text-3xl">{score}</span> points</p>
                </div>
              )}
              
              <div className="mt-8 flex justify-center gap-4">
                <button 
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Try Again <i className="fas fa-redo ml-2"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        
        <div className="bg-black/20 py-4 text-center text-white/70 text-md ">
          <p>Powered by QuizMaster APP • Developed By Shayan Sheikh • All Right Reserved &reg;</p>
        </div>
      </div>
    </div>
  );
}

export default App;