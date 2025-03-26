"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { CheckCircle, Clock, AlertTriangle, X, Award, ArrowLeft, CheckCheck, XCircle } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer?: number // Index of the correct answer
}

interface AnswerState {
  [questionId: number]: number | null
}

// Added correct answers for demonstration
const questions: Question[] = [
  { id: 1, question: "What is Next.js?", options: ["A framework", "A library", "An API", "None"], correctAnswer: 0 },
  { id: 2, question: "What is React?", options: ["Library", "Framework", "Language", "None"], correctAnswer: 0 },
  {
    id: 3,
    question: "What is TypeScript?",
    options: ["JS Superset", "Programming Language", "Compiler", "None"],
    correctAnswer: 0,
  },
]



const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [answers, setAnswers] = useState<AnswerState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeResultTab, setActiveResultTab] = useState<"all" | "correct" | "incorrect">("all")
  const confettiRef = useRef<HTMLDivElement>(null)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)

  // Load saved progress from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem("quiz-answers")
    const savedTime = localStorage.getItem("quiz-time")

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    if (savedTime) {
      setTimeLeft(Number.parseInt(savedTime))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("quiz-answers", JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    localStorage.setItem("quiz-time", timeLeft.toString())
  }, [timeLeft])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0
          if (newTime === 0) {
            handleSubmit()
          }
          return newTime
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft, isSubmitted])

  // Confetti effect on submission
  useEffect(() => {
    if (isSubmitted && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      confetti({
        particleCount: 150,
        spread: 90,
        origin: {
          x: rect.left / window.innerWidth + rect.width / window.innerWidth / 2,
          y: rect.top / window.innerHeight,
        },
      })

      // Trigger score animation after a short delay
      setTimeout(() => {
        setShowScoreAnimation(true)
      }, 300)
    }
  }, [isSubmitted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
      // Clear localStorage after submission
      localStorage.removeItem("quiz-answers")
      localStorage.removeItem("quiz-time")
    }, 1500)
  }

  const getCompletionPercentage = () => {
    const answeredCount = Object.keys(answers).length
    return (answeredCount / questions.length) * 100
  }

  const getAnswerStatus = (questionId: number) => {
    if (answers[questionId] !== undefined) return "answered"
    return "unanswered"
  }

  // Calculate results
  const getScore = () => {
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })
    return correctCount
  }

  const getScorePercentage = () => {
    return Math.round((getScore() / questions.length) * 100)
  }

  const isAnswerCorrect = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId)
    return question && answers[questionId] === question.correctAnswer
  }

  const getFilteredQuestions = () => {
    if (activeResultTab === "all") return questions
    if (activeResultTab === "correct") return questions.filter((q) => isAnswerCorrect(q.id))
    if (activeResultTab === "incorrect")
      return questions.filter((q) => !isAnswerCorrect(q.id) && answers[q.id] !== undefined)
    return questions
  }

  if (isSubmitted) {
    return (
      <div className="h-screen w-screen flex bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* Left side - Score */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/3 bg-white shadow-lg p-6 flex flex-col items-center justify-center"
            ref={confettiRef}
          >
            <div className="flex flex-col items-center justify-center h-full w-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-6"
              >
                <Award className="w-24 h-24 text-yellow-500" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Completed!</h2>

              <div className="relative w-48 h-48 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={283}
                      strokeDashoffset={283 - (283 * getScorePercentage()) / 100}
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * getScorePercentage()) / 100 }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl font-bold text-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {showScoreAnimation ? getScorePercentage() : 0}%
                    </motion.span>
                    <span className="text-gray-500 text-sm">Score</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-center gap-4 mb-4"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-blue-600">{getScore()}</span>
                    <span className="text-sm text-gray-500">Correct</span>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-red-500">{questions.length - getScore()}</span>
                    <span className="text-sm text-gray-500">Incorrect</span>
                  </div>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsSubmitted(false)
                  setAnswers({})
                  setTimeLeft(600)
                  setCurrentQuestionIndex(0)
                  setShowScoreAnimation(false)
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Take Another Test
              </motion.button>
            </div>
          </motion.div>

          {/* Right side - Questions and Answers */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-2/3 p-6 overflow-y-auto"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>

              {/* Filter tabs */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveResultTab("all")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    activeResultTab === "all" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Questions
                </button>
                <button
                  onClick={() => setActiveResultTab("correct")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    activeResultTab === "correct"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Correct
                </button>
                <button
                  onClick={() => setActiveResultTab("incorrect")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    activeResultTab === "incorrect"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Incorrect
                </button>
              </div>

              {/* Questions list */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeResultTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {getFilteredQuestions().map((q) => {
                      const userAnswer = answers[q.id]
                      const isCorrect = userAnswer === q.correctAnswer
                      const isAnswered = userAnswer !== undefined

                      return (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: q.id * 0.1 }}
                          className={`p-4 rounded-lg border-l-4 ${
                            !isAnswered
                              ? "border-l-gray-400 bg-gray-50"
                              : isCorrect
                                ? "border-l-green-500 bg-green-50"
                                : "border-l-red-500 bg-red-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-800">
                              <span className="inline-block w-6 h-6 text-sm bg-gray-200 rounded-full text-center leading-6 mr-2">
                                {q.id}
                              </span>
                              {q.question}
                            </h3>
                            {isAnswered && (
                              <div className={`flex items-center ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                                {isCorrect ? <CheckCheck className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </div>
                            )}
                          </div>

                          <div className="ml-8 space-y-2">
                            {q.options.map((option, index) => {
                              const isUserSelection = userAnswer === index
                              const isCorrectAnswer = q.correctAnswer === index

                              return (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md flex items-center ${
                                    isUserSelection && isCorrectAnswer
                                      ? "bg-green-100 border border-green-300"
                                      : isUserSelection && !isCorrectAnswer
                                        ? "bg-red-100 border border-red-300"
                                        : !isUserSelection && isCorrectAnswer
                                          ? "bg-green-50 border border-green-200"
                                          : "bg-white border border-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${
                                      isUserSelection
                                        ? isCorrectAnswer
                                          ? "bg-green-500 text-white"
                                          : "bg-red-500 text-white"
                                        : isCorrectAnswer
                                          ? "bg-green-500 text-white"
                                          : "border border-gray-300"
                                    }`}
                                  >
                                    {isUserSelection && !isCorrectAnswer && <X className="w-3 h-3" />}
                                    {isCorrectAnswer && <CheckCircle className="w-3 h-3" />}
                                  </div>
                                  <span
                                    className={`text-sm ${
                                      isUserSelection && !isCorrectAnswer
                                        ? "line-through text-red-800"
                                        : isCorrectAnswer
                                          ? "font-medium text-green-800"
                                          : "text-gray-800"
                                    }`}
                                  >
                                    {option}
                                  </span>
                                  {isUserSelection && !isCorrectAnswer && (
                                    <span className="ml-auto text-xs text-red-600">Your answer</span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className="ml-auto text-xs text-green-600">Correct answer</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Left Navbar (Question Numbers) */}
      <motion.nav
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-1/5 bg-white shadow-lg p-6 flex flex-col items-center space-y-6"
      >
        <h2 className="text-xl font-semibold text-gray-800">Questions</h2>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {Object.keys(answers).length} of {questions.length} answered
        </p>

        <div className="grid grid-cols-3 gap-3 w-full">
          {questions.map((q, index) => {
            const status = getAnswerStatus(q.id)
            return (
              <motion.button
                key={q.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ${
                  currentQuestionIndex === index
                    ? "bg-blue-600 text-white shadow-md"
                    : status === "answered"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {q.id}
              </motion.button>
            )
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          onClick={() => setShowConfirmation(true)}
        >
          Submit Test
        </motion.button>
      </motion.nav>

      {/* Main Question Display */}
      <div className="w-4/5 flex flex-col justify-center items-center p-8 relative">
        {/* Timer in the Top Right Corner */}
        <motion.div
          className={`absolute top-6 right-6 px-4 py-2 rounded-lg text-lg font-bold flex items-center gap-2 ${
            timeLeft < 60 ? "bg-red-500 text-white" : "bg-white shadow-md text-gray-800"
          }`}
          animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: timeLeft < 60 ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
        >
          {timeLeft < 60 ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          {formatTime(timeLeft)}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {/* Question Number */}
            <div className="mb-2 text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>

            {/* Question */}
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{questions[currentQuestionIndex].question}</h1>

            {/* Options */}
            <div className="flex flex-col space-y-4 w-full">
              {questions[currentQuestionIndex].options.map((option, index) => {
                const isSelected = answers[questions[currentQuestionIndex].id] === index
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl text-lg transition-all duration-200 flex items-center ${
                      isSelected
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-800"
                        : "bg-white border border-gray-200 hover:border-blue-300 text-gray-800 hover:bg-blue-50"
                    }`}
                    onClick={() => handleAnswerSelect(questions[currentQuestionIndex].id, index)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                        isSelected ? "bg-blue-500 text-white" : "border border-gray-300"
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4" />}
                    </div>
                    {option}
                  </motion.button>
                )
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium disabled:opacity-50 hover:bg-gray-300 transition-colors"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Submit Test?</h3>
              <p className="mb-6 text-gray-600">
                You have answered {Object.keys(answers).length} out of {questions.length} questions.
                {Object.keys(answers).length < questions.length && " Some questions are still unanswered."}
              </p>
              <div className="flex space-x-3">
                <button
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TestPage

  
