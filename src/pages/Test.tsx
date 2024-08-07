import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question } from '../utils/Types'; // Ensure this matches your Question type
import { useNavigate } from 'react-router-dom';
import { questionsApi, answerSubmitApi } from '../services/allApis';
import './Test.css'; // Import the CSS file

const TIMER_DURATION = 60000; // 1 minute in milliseconds

const Test: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [userAnswers, setUserAnswers] = useState<Map<number, string | null>>(new Map());
    const navigate = useNavigate();
    const id = localStorage.getItem('currentId') ?? null;
    const token = localStorage.getItem('token');
    const reqHeader = useMemo(() => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }), [token]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                if (id != null) {
                    const response = await questionsApi(reqHeader);
                    if ("data" in response) {
                        if (response && Array.isArray(response.data)) {
                            setQuestions(response.data);
                            localStorage.setItem('numQuestions', response.data.length.toString()); // Store number of questions
                        }
                    }
                } else {
                    alert("Please register First");
                    navigate("/");
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [id, reqHeader, navigate]);

    const handleSubmit = useCallback(async () => {
        console.log('Submitting...');
        console.log('User Answers:', userAnswers);
        console.log('Questions:', questions);

        const attendedQuestions = Array.from(userAnswers.keys()).length;
        console.log('Attended Questions:', attendedQuestions);

        const score = questions.reduce((acc, question, index) => {
            if (userAnswers.get(index) === question.choices[question.correctChoice]) {
                return acc + 1; // Award 1 point for each correct answer
            }
            return acc;
        }, 0);
        console.log('Score:', score);

        const answers = {
            score
        };

        try {
            const result = await answerSubmitApi(reqHeader, answers, id);
            console.log('API Result:', result);

            // Store the result, total number of questions, and number of attended questions in local storage
            localStorage.setItem('result', JSON.stringify({ score, total: questions.length, attended: attendedQuestions }));

            navigate('/submit');
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    }, [questions, userAnswers, reqHeader, id, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [handleSubmit]);

    const currentQuestion = questions[currentQuestionIndex];
    const options = currentQuestion ? currentQuestion.choices || [] : [];

    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            // Restore selected option for the next question
            setSelectedOption(userAnswers.get(currentQuestionIndex + 1) ?? null);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            // Restore selected option for the previous question
            setSelectedOption(userAnswers.get(currentQuestionIndex - 1) ?? null);
        }
    };

    useEffect(() => {
        // Update userAnswers whenever selectedOption changes
        setUserAnswers(prevAnswers => new Map(prevAnswers).set(currentQuestionIndex, selectedOption));
    }, [selectedOption, currentQuestionIndex]);

    if (questions.length === 0) return <p>Loading questions...</p>;
    if (currentQuestionIndex >= questions.length) return <p>Invalid question index.</p>;

    return (
        <div className="test-container">
            <h1>Question {currentQuestionIndex + 1}</h1>
            <div className="question-container">
                <p>{currentQuestion ? currentQuestion.question : 'Loading question...'}</p>
                <div className="options-container">
                    {options.length > 0 ? (
                        options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                                onClick={() => setSelectedOption(option)}
                            >
                                {option}
                            </button>
                        ))
                    ) : (
                        <p>No options available</p>
                    )}
                </div>
            </div>
            <div className="timer">
                Time left: {Math.floor(timeLeft / 1000)}s
            </div>
            <div className="navigation-buttons">
                <button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                    Previous
                </button>
                <button onClick={goToNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                    Next
                </button>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
};

export default Test;