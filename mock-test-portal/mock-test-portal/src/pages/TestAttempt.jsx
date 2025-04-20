import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Heading, Text, RadioGroup, Stack, Radio, Button, Input, Progress, useToast
} from "@chakra-ui/react";
import { mockQuestions } from "../data/mockQuestions";  // ✅ Correct import

const TestAttempt = () => {
  const { testId, testName } = useParams(); // Get test ID and name
  const decodedTestName = decodeURIComponent(testName); // Decode the test name
  const navigate = useNavigate();
  const toast = useToast();

  // Convert testId to integer since useParams() returns string
  const numericTestId = parseInt(testId, 10);

  // Ensure questions exist for the given testId
  const questions = mockQuestions[numericTestId] || [];

  const [userName, setUserName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);

  console.log("Selected Test ID:", testId);
  console.log("Selected Test Name:", decodedTestName);

  // Ensure we have at least one question before trying to access it
  if (questions.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Heading>No Questions Found</Heading>
        <Text>There are no available questions for this test.</Text>
        <Button mt={4} colorScheme="blue" onClick={() => navigate("/tests")}>
          Go Back to Tests
        </Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft === 0) {
      toast({
        title: "Time’s up!",
        description: "Moving to the next question.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      handleNext(); // Auto-move to next question when time runs out
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleNext = () => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const updatedResponses = [
      ...responses,
      { question: currentQuestion.question, selectedAnswer, correctAnswer: currentQuestion.correctAnswer, isCorrect }
    ];

    setResponses(updatedResponses);
    if (isCorrect) setScore(score + 1);
    setSelectedAnswer("");
    setTimeLeft(60); // Reset timer

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Store results
      const finalScore = score + (isCorrect ? 1 : 0);
      const resultData = {
        userName,
        score: finalScore,
        total: questions.length,
        responses: updatedResponses,
        timestamp: new Date().toLocaleString(),
        testName,
      };

      setTimeout(() => {
        const storedResults = JSON.parse(localStorage.getItem("testResults")) || [];
        storedResults.push(resultData);
        localStorage.setItem("testResults", JSON.stringify(storedResults));
        navigate("/results", { state: resultData });
      }, 100);
    }
  };

  return (
    <Box p={6} textAlign="center">
      {!isNameEntered ? (
        <>
          <Heading mb={4}>Enter Your Name</Heading>
          <Input
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            size="lg"
            mb={4}
          />
          <Button colorScheme="blue" onClick={() => setIsNameEntered(true)} isDisabled={!userName}>
            Start {testName}
          </Button>
        </>
      ) : (
        <>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} size="sm" colorScheme="blue" mb={4} />
          <Text fontSize="sm" color="red.500">Time left: {timeLeft}s</Text>
          <Heading mb={4}>Question {currentQuestionIndex + 1}</Heading>
          <Text fontSize="lg" mb={4}>{currentQuestion.question}</Text>

          <RadioGroup onChange={setSelectedAnswer} value={selectedAnswer}>
            <Stack spacing={3}>
              {currentQuestion.options.map((option, index) => (
                <Radio key={index} value={option} size="lg">{option}</Radio>
              ))}
            </Stack>
          </RadioGroup>

          <Button mt={6} colorScheme="blue" onClick={handleNext} isDisabled={!selectedAnswer}>
            {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default TestAttempt;
