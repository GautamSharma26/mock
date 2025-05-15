import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  RadioGroup,
  Stack,
  Radio,
  Button,
  Input,
  Progress,
  useToast,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { mockQuestions } from "../data/mockQuestions";

const TestAttempt = () => {
  const { testId, testName } = useParams();
  const decodedTestName = decodeURIComponent(testName);
  const navigate = useNavigate();
  const toast = useToast();

  const numericTestId = parseInt(testId, 10);
  const questions = mockQuestions[numericTestId] || [];

  const [userName, setUserName] = useState("");
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionStatus, setQuestionStatus] = useState(
    Array(questions.length).fill("not-visited")
  );
  const [markedForReview, setMarkedForReview] = useState(
    Array(questions.length).fill(false)
  );
  const [showReviewScreen, setShowReviewScreen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    const storedName = savedProfile?.userName || localStorage.getItem("testUserName");
    if (storedName) {
      setUserName(storedName);
      setIsNameEntered(true);
    }
  }, []);

  useEffect(() => {
    if (!isNameEntered) return;
    if (timeLeft === 0) {
      toast({
        title: "Time’s up!",
        description: "Moving to the next question.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      handleNext();
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isNameEntered]);

  const handleNext = (markReview = false) => {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };
    setResponses(updatedResponses);

    const updatedStatus = [...questionStatus];
    if (markReview) {
      updatedStatus[currentQuestionIndex] = "review";
    } else {
      updatedStatus[currentQuestionIndex] = selectedAnswer ? "answered" : "not-answered";
    }
    setQuestionStatus(updatedStatus);

    const updatedReviewFlags = [...markedForReview];
    updatedReviewFlags[currentQuestionIndex] = markReview;
    setMarkedForReview(updatedReviewFlags);

    setSelectedAnswer("");
    setTimeLeft(60);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowReviewScreen(true);
    }
  };

  const handlePaletteClick = (index) => {
    const updatedStatus = [...questionStatus];
    if (updatedStatus[index] === "not-visited") {
      updatedStatus[index] = "current";
    }
    setQuestionStatus(updatedStatus);
    setCurrentQuestionIndex(index);
    setSelectedAnswer(responses[index]?.selectedAnswer || "");
    setTimeLeft(60);
  };

  const handleFinalSubmit = () => {
    const finalScore = responses.filter((res) => res?.isCorrect).length;
    const resultData = {
      userName,
      score: finalScore,
      total: questions.length,
      responses,
      timestamp: new Date().toLocaleString(),
      testName: decodedTestName,  // Ensure the decoded test name is passed
    };

    const storedResults = JSON.parse(localStorage.getItem("testResults")) || [];
    storedResults.push(resultData);
    localStorage.setItem("testResults", JSON.stringify(storedResults));
    navigate("/results", { state: resultData });  // Pass resultData to results page
  };

  const getColorForStatus = (status, index) => {
    if (index === currentQuestionIndex) return "purple";
    switch (status) {
      case "answered":
        return "green";
      case "not-answered":
        return "red";
      case "review":
        return "orange";
      default:
        return "gray";
    }
  };

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

  if (!isNameEntered) {
    return (
      <Box p={6} textAlign="center">
        <Heading mb={4}>Enter Your Name</Heading>
        <Input
          placeholder="Please Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          size="lg"
          mb={4}
        />
        <Button
          colorScheme="blue"
          onClick={() => {
            localStorage.setItem("testUserName", userName);
            setIsNameEntered(true);
          }}
          isDisabled={!userName}
        >
          Start {decodedTestName}
        </Button>
      </Box>
    );
  }

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align="stretch"
      height="100%"
      p={{ base: 3, md: 6 }}
      gap={6}
    >
      <Box flex="1">
        <Heading size="md" mb={2}>
          Welcome, {userName}
        </Heading>

        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          size="sm"
          colorScheme="blue"
          mb={4}
        />
        <Text fontSize="sm" color="red.500" mb={2}>
          Time left: {timeLeft}s
        </Text>

        {showReviewScreen ? (
          <>
            <Heading mb={4}>Review Your Answers</Heading>
            <Stack spacing={3} mb={6}>
              {questions.map((q, idx) => (
                <Text key={idx}>
                  <strong>Q{idx + 1}:</strong>{" "}
                  {responses[idx]?.selectedAnswer
                    ? `Answered (${responses[idx].selectedAnswer})`
                    : markedForReview[idx]
                    ? "Marked for Review"
                    : "Not Answered"}
                </Text>
              ))}
            </Stack>
            <Button colorScheme="green" onClick={handleFinalSubmit}>
              Submit Test
            </Button>
          </>
        ) : (
          <>
            <Heading mb={4}>Question {currentQuestionIndex + 1}</Heading>
            <Text fontSize="lg" mb={4}>{currentQuestion.question}</Text>

            <RadioGroup onChange={setSelectedAnswer} value={selectedAnswer}>
              <Stack spacing={3}>
                {currentQuestion.options.map((option, index) => (
                  <Radio key={index} value={option} size="lg">
                    {option}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>

            <Flex gap={4} mt={6} wrap="wrap">
              <Button colorScheme="orange" onClick={() => handleNext(true)}>
                Mark for Review & Next
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleNext(false)}
                isDisabled={!selectedAnswer}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next"
                  : "Review & Submit"}
              </Button>
            </Flex>
          </>
        )}
      </Box>

      <Box
        width={{ base: "100%", md: "300px" }}
        flexShrink={0}
        p={4}
        borderRadius="md"
      >
        <Heading size="md" mb={3}>
          Question Palette
        </Heading>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(40px, 1fr))"
          gap={2}
          mb={4}
        >
          {questions.map((_, index) => (
            <Button
              key={index}
              size="sm"
              colorScheme={getColorForStatus(questionStatus[index], index)}
              onClick={() => handlePaletteClick(index)}
            >
              {index + 1}
            </Button>
          ))}
        </Box>

        <Divider mb={3} />
        <Box fontSize="sm">
          <Text mb={1}><strong>Legend:</strong></Text>
          <Stack spacing={1}>
            <Flex align="center" gap={2}><Button size="xs" colorScheme="gray" /> Not Visited</Flex>
            <Flex align="center" gap={2}><Button size="xs" colorScheme="green" /> Answered</Flex>
            <Flex align="center" gap={2}><Button size="xs" colorScheme="red" /> Not Answered</Flex>
            <Flex align="center" gap={2}><Button size="xs" colorScheme="orange" /> Marked for Review</Flex>
            <Flex align="center" gap={2}><Button size="xs" colorScheme="purple" /> Current</Flex>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default TestAttempt;
