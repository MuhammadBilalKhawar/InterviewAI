import React, { useState, useEffect, useRef } from "react";
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
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      <header className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-sky-400">InterviewAI</div>
        <nav className="flex items-center gap-6">
          <a href="/dashboard" className="text-slate-300">
            Dashboard
          </a>
          <a href="/practice" className="text-sky-300 font-medium">
            Practice
          </a>
          <a href="/history" className="text-slate-300">
            History
          </a>
          <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center">
            J
          </div>
        </nav>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-4xl font-extrabold mb-8">Practice Interview</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-700/30 border border-red-600 rounded text-red-300">
            {error}
          </div>
        )}

        {selectedQuestion ? (
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-slate-700/60 rounded text-white"
            >
              ← Back to Questions
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Question card */}
              <div className="bg-slate-800/40 rounded-2xl p-6 ring-1 ring-slate-700">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">📘</div>
                  <h2 className="text-xl font-semibold">Question</h2>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {selectedQuestion.text}
                </p>
                <div className="flex gap-2 mb-6">
                  {[selectedQuestion.category, selectedQuestion.difficulty].map(
                    (t) => (
                      <span
                        key={t}
                        className="text-sm px-3 py-1 rounded-full bg-slate-700/50 text-slate-200"
                      >
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
              {/* Right: Answer panel / Feedback */}
              <div className="bg-slate-800/40 rounded-2xl p-6 ring-1 ring-slate-700 flex flex-col">
                {feedback ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">AI Feedback</h3>
                    <div className="space-y-3 text-sm">
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
                      <ul className="list-disc ml-4 text-slate-300">
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
                      className="w-full mt-4 bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-white"
                    >
                      Try Another Answer
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">⚡</div>
                      <h2 className="text-xl font-semibold">Your Answer</h2>
                    </div>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="flex-1 min-h-[220px] w-full resize-none bg-slate-900/30 border border-slate-700 rounded-md p-4 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    {/* Voice controls */}
                    <div className="mt-3 mb-2 flex items-center gap-3">
                      <button
                        onClick={() =>
                          isRecording ? stopRecording() : startRecording()
                        }
                        className={`px-3 py-2 rounded-md text-white ${
                          isRecording
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {isRecording ? "Stop Voice" : "Start Voice"}
                      </button>
                      <label className="text-sm text-slate-400 flex items-center gap-2">
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

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-slate-400">
                        {answer.length} characters
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setAnswer("");
                            setTranscript("");
                          }}
                          className="bg-slate-700/60 hover:bg-slate-700/80 text-white px-4 py-2 rounded-md"
                        >
                          Clear
                        </button>
                        <button
                          onClick={submitForEvaluation}
                          disabled={submitting}
                          className="bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-white disabled:opacity-50"
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
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full max-w-md px-4 py-2 rounded-md bg-slate-900/30 border border-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {loading ? (
              <div className="text-slate-300">Loading questions...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.length === 0 ? (
                  <div className="col-span-full text-slate-400">
                    No questions found.
                  </div>
                ) : (
                  filteredQuestions.map((q) => (
                    <div
                      key={q._id}
                      className="bg-slate-800/40 rounded-2xl p-6 ring-1 ring-slate-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="text-2xl mr-2">📘</div>
                          <h2 className="text-lg font-semibold">
                            {q.category} - {q.difficulty}
                          </h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-4">
                          {q.text}
                        </p>
                      </div>
                      <button
                        onClick={() => handleSolve(q)}
                        className="mt-2 w-full bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-md text-white"
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
