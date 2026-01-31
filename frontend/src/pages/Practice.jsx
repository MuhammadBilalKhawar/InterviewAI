import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
const API_BASE = "https://interviewai-zmzj.onrender.com/api";

export default function Practice() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [autoSubmit, setAutoSubmit] = useState(false);
  const recognitionRef = useRef(null);
  const recordingActiveRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuestions();
    
    // Check if a question ID was passed in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('q');
    if (questionId) {
      // Store the question ID to select after questions are fetched
      sessionStorage.setItem('selectedQuestionId', questionId);
    }
  }, []);

  // cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  // clear any lingering transcripts/answer on mount (prevents browser form restoration)
  useEffect(() => {
    setTranscript("");
    setAnswer("");
    finalTranscriptRef.current = "";
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setFilteredQuestions(
        questions.filter((q) =>
          q.text.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredQuestions(questions);
    }
  }, [search, questions]);

  async function fetchQuestions() {
    try {
      setLoading(true);
      setError("");
      setFeedback(null);
      const res = await fetch(`${API_BASE}/questions/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data);
      setFilteredQuestions(data);
      
      // Auto-select question if ID was passed in URL
      const selectedId = sessionStorage.getItem('selectedQuestionId');
      if (selectedId && data.length > 0) {
        const question = data.find(q => q._id === selectedId);
        if (question) {
          setSelectedQuestion(question);
          sessionStorage.removeItem('selectedQuestionId'); // Clear after use
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitForEvaluation() {
    if (!answer.trim()) {
      setError("Please enter an answer.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const res = await fetch(`${API_BASE}/answers/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: selectedQuestion._id,
          answerText: answer,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Grade failed");
      }
      const data = await res.json();
      setFeedback(data.parsed);
      alert("Answer submitted! See feedback on the right.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startRecording() {
    setError("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      finalTranscriptRef.current = "";
      recordingActiveRef.current = true;
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.interimResults = true;
      recog.continuous = true; // keep listening across pauses
      recog.maxAlternatives = 1;

      recog.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            finalTranscriptRef.current = (
              finalTranscriptRef.current +
              " " +
              text
            ).trim();
          } else {
            interim += text;
          }
        }
        const combined = (
          finalTranscriptRef.current + (interim ? " " + interim : "")
        ).trim();
        setTranscript(combined);
        setAnswer(combined);
      };

      recog.onerror = (ev) => {
        setError("Speech recognition error: " + (ev.error || "unknown"));
      };

      recog.onend = () => {
        // If user still wants to record, restart recognition (keeps manual stop control)
        if (recordingActiveRef.current) {
          try {
            recog.start();
          } catch (e) {
            setIsRecording(false);
            recognitionRef.current = null;
          }
        } else {
          setIsRecording(false);
          recognitionRef.current = null;
        }
      };

      recognitionRef.current = recog;
      recog.start();
      setIsRecording(true);
      setTranscript("");
    } catch (err) {
      setError("Could not start speech recognition: " + err.message);
    }
  }

  function stopRecording() {
    // signal we want to stop (prevents onend from restarting)
    try {
      recordingActiveRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      // ignore
    }
    setIsRecording(false);
    // ensure final transcript is applied
    const finalText = finalTranscriptRef.current.trim();
    if (finalText) {
      setTranscript(finalText);
      setAnswer(finalText);
    }
    if (autoSubmit && finalText) {
      submitForEvaluation();
    }
  }

  const clearAnswer = () => setAnswer("");
  const handleSolve = (question) => {
    setSelectedQuestion(question);
    setAnswer("");
    setFeedback(null);
    setError("");
  };
  const handleBack = () => {
    setSelectedQuestion(null);
    setAnswer("");
    setFeedback(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-900 via-black to-slate-950 text-white">
      <NavBar mode="app" active="practice" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 sm:mb-8">Practice Interview</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-700/30 border border-red-600 rounded text-red-300">
            {error}
          </div>
        )}

        {selectedQuestion ? (
          <>
            <div className="mb-4 sm:mb-6">
              <button
                onClick={handleBack}
                className="mb-4 px-3 sm:px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded text-amber-200 hover:bg-amber-500/30 text-sm sm:text-base"
              >
                ← Back to Questions
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Left: Question card */}
              <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 ring-1 ring-amber-500/20">
                <div className="flex items-center mb-4">
                  <div className="text-xl sm:text-2xl mr-2 sm:mr-3">📘</div>
                  <h2 className="text-lg sm:text-xl font-semibold">Question</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6 text-sm sm:text-base">
                  {selectedQuestion.text}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[selectedQuestion.category, selectedQuestion.difficulty].map(
                    (t) => (
                      <span
                        key={t}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/20"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
              {/* Right: Answer panel / Feedback */}
              <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 ring-1 ring-amber-500/20 flex flex-col">
                {feedback ? (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-4">AI Feedback</h3>
                    <div className="space-y-3 text-xs sm:text-sm">
                      <div>
                        <strong>Overall Score:</strong> {feedback.overall}/10
                      </div>
                      <div>
                        <strong>Clarity:</strong> {feedback.clarity}/10
                      </div>
                      <div>
                        <strong>Relevance:</strong> {feedback.relevance}/10
                      </div>
                      <div>
                        <strong>Depth:</strong> {feedback.depth}/10
                      </div>
                      <div>
                        <strong>Structure:</strong> {feedback.structure}/10
                      </div>
                      <div>
                        <strong>Feedback:</strong>
                      </div>
                      <ul className="list-disc ml-4 text-slate-300 text-xs sm:text-sm">
                        {feedback.feedback?.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setFeedback(null);
                        setAnswer("");
                      }}
                      className="w-full mt-4 bg-amber-500 hover:bg-amber-400 px-3 sm:px-4 py-2 rounded-md text-black font-semibold text-sm sm:text-base"
                    >
                      Try Another Answer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3">⚡</div>
                      <h2 className="text-lg sm:text-xl font-semibold">Your Answer</h2>
                    </div>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="flex-1 min-h-[180px] sm:min-h-[220px] w-full resize-none bg-slate-950/50 border border-amber-500/30 rounded-md p-3 sm:p-4 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 text-white text-sm sm:text-base"
                    />

                    {/* Voice controls */}
                    <div className="mt-3 mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          isRecording ? stopRecording() : startRecording()
                        }
                        className={`px-2 sm:px-3 py-2 rounded-md text-white text-sm sm:text-base ${
                          isRecording
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                        }`}
                      >
                        {isRecording ? "Stop Voice" : "Start Voice"}
                      </button>
                      <label className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={autoSubmit}
                          onChange={(e) => setAutoSubmit(e.target.checked)}
                        />
                        Auto-submit on stop
                      </label>
                      {/* <div className="text-sm text-slate-400 ml-auto">
                        {transcript ? "Live:" : ""}{" "}
                        <span className="text-slate-200 ml-1">
                          {transcript}
                        </span>
                      </div> */}
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4 gap-2 sm:gap-0">
                      <div className="text-xs sm:text-sm text-slate-400">
                        {answer.length} characters
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setAnswer("");
                            setTranscript("");
                          }}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-3 sm:px-4 py-2 rounded-md border border-amber-500/30 text-sm sm:text-base flex-1 sm:flex-none"
                        >
                          Clear
                        </button>
                        <button
                          onClick={submitForEvaluation}
                          disabled={submitting}
                          className="bg-amber-500 hover:bg-amber-400 px-3 sm:px-4 py-2 rounded-md text-black font-semibold disabled:opacity-50 text-sm sm:text-base flex-1 sm:flex-none"
                        >
                          {submitting
                            ? "Submitting..."
                            : "✈️ Submit for Evaluation"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            </>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full sm:w-auto sm:max-w-md px-3 sm:px-4 py-2 rounded-md bg-slate-950/50 border border-amber-500/30 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              />
            </div>
            {loading ? (
              <div className="text-slate-400">Loading questions...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredQuestions.length === 0 ? (
                  <div className="col-span-full text-slate-400">
                    No questions found.
                  </div>
                ) : (
                  filteredQuestions.map((q) => (
                    <div
                      key={q._id}
                      className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 ring-1 ring-amber-500/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-2 gap-2">
                          <div className="text-lg sm:text-2xl flex-shrink-0">📘</div>
                          <h2 className="text-sm sm:text-lg font-semibold line-clamp-2">
                            {q.category} - {q.difficulty}
                          </h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-4 text-sm sm:text-base line-clamp-3">
                          {q.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSolve(q)}
                        className="mt-2 w-full bg-amber-500 hover:bg-amber-400 px-3 sm:px-4 py-2 rounded-md text-black font-semibold text-sm sm:text-base"
                      >
                        Solve
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
