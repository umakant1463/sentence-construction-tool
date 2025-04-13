import { useEffect, useState } from "react";
import { Question } from "./types";
import { Sentence } from "./components/sentence";
import { Options } from "./components/options";

function App() {
  const [questionId, setQuestionId] = useState(1); // Tracks current question number
  const [answers, setAnswers] = useState<string[][]>([]); // Stores all selected answers
  const [showFeedback, setShowFeedback] = useState(false); // Controls feedback screen
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  // 👇 Fetch the question
  useEffect(() => {
    fetch(`http://localhost:3000/questions/${questionId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setSelectedWords(Array(data.correctAnswers.length).fill(""));
      });
  }, [questionId]);

  useEffect(() => {
    fetch("http://localhost:3000/questions")
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(data);
      })
      .catch((error) => {
        console.error("Failed to fetch all questions:", error);
      });
  }, []);

  useEffect(() => {
    if (showFeedback) return;
  
    setTimeLeft(30); // Reset timer for new question
  
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
  
          // Auto move to next question or show feedback
          if (questionId < 10) {
            setAnswers((prevAns) => [...prevAns, selectedWords]);
            setQuestionId((prevId) => prevId + 1);
          } else {
            // 🛠 Delay feedback screen just enough to ensure answers are updated
            setAnswers((prevAns) => {
              const updatedAnswers = [...prevAns, selectedWords];
            
              // ✅ Delay showFeedback until state is updated
              setTimeout(() => {
                setAnswers(updatedAnswers);
                setShowFeedback(true);
              }, 0);
            
              return prevAns; // Temporarily return previous answers (will update after timeout)
            });
          }
  
          return 0;
        }
  
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [questionId, showFeedback]);


  const handleWordSelect = (word: string) => {
    const index = selectedWords.findIndex((w) => !w);
    if (index === -1) return;

    const updated = [...selectedWords];
    updated[index] = word;
    setSelectedWords(updated);
  };

  const handleBlankClick = (index: number) => {
    const updated = [...selectedWords];
    updated[index] = "";
    setSelectedWords(updated);
  };

  if (!question) return <div>Loading...</div>;

  // const questionsData = [
  //   {
  //     sentence: "The ___ fox ___ over the ___ dog in a ___ leap.",
  //     correctAnswers: ["quick", "jumps", "lazy", "graceful"],
  //   },
  //   {
  //     sentence: "She ___ her bag, ___ breakfast, ___ her shoes, and ___ to school.",
  //     correctAnswers: ["packed", "ate", "wore", "walked"],
  //   },
  //   {
  //     sentence: "The ___ programmer wrote a ___ algorithm to solve the ___ problem in a ___ way.",
  //     correctAnswers: ["brilliant", "complex", "unique", "efficient"],
  //   }
  // ];

  if (showFeedback && allQuestions.length < 10) {
    return <div className="text-center mt-10 text-xl">Loading results...</div>;
  }
  if (showFeedback) {
    const totalQuestions = 10;
    let score = 0;
  
    const feedback = answers.map((userAns, idx) => {
      const correct = allQuestions[idx].correctAnswers;
      const question = allQuestions[idx].sentence;
      const isCorrect = JSON.stringify(userAns) === JSON.stringify(correct);
      if (isCorrect) score += 1;
  
      return {
        question,
        userAnswer: userAns,
        correctAnswer: correct,
        isCorrect,
      };
    });
  
    return (
      <div className="w-full max-w-[90%] md:max-w-2xl mx-auto mt-20 p-4 text-center font-sans">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Your Results</h2>
        <p className="text-lg mb-4">Score: {score} / {totalQuestions}</p>
    
        {feedback.map((item, i) => (
          <div key={i} className="mb-6 text-left border-b pb-4">
            <p className="font-semibold mb-1">Q{i + 1}: {item.question}</p>
            <p className="text-sm">Your answer: {item.userAnswer.join(", ")}</p>
            <p className="text-sm">
              {item.isCorrect ? (
                <span className="text-green-600">Correct ✅</span>
              ) : (
                <>
                  <span className="text-red-600">Incorrect ❌</span> <br />
                  Correct answer: {item.correctAnswer.join(", ")}
                </>
              )}
            </p>
          </div>
        ))}
    
        {/* 🔁 Play Again Button */}
        <button
          onClick={() => {
            setQuestionId(1);
            setAnswers([]);
            setShowFeedback(false);
            setSelectedWords(["", "", "", ""]);
            setTimeLeft(30);
          }}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[90%] md:max-w-2xl mx-auto mt-20 p-4 text-center font-sans">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Fill in the Blanks</h1>
      
      <div className="text-right text-red-500 font-semibold text-lg mb-4">
      Time left: {timeLeft}s
    </div>
      <Sentence
        sentence={question.sentence}
        selectedWords={selectedWords}
        onBlankClick={handleBlankClick}
      />
      <Options
        options={question.options}
        onSelect={handleWordSelect}
        usedWords={selectedWords}
      />
      <div className="mt-6">
  {questionId < 10 ? (
    <button
      onClick={() => {
        setAnswers([...answers, selectedWords]); // Save current answers
        setQuestionId(questionId + 1); // Move to next question
      }}
      disabled={selectedWords.includes("")}
      className={`px-6 py-2 rounded font-semibold text-white ${
        selectedWords.includes("") ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Next
    </button>
  ) : (
    <button
      onClick={() => {
        setAnswers([...answers, selectedWords]); // Save final answers
        setShowFeedback(true); // Show feedback screen
      }}
      disabled={selectedWords.includes("")}
      className={`px-6 py-2 rounded font-semibold text-white ${
        selectedWords.includes("") ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
      }`}
        >
          Submit
        </button>
      )}
    </div>
    </div>
  );
}

export default App;
