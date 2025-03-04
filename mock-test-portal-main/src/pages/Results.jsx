import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, Divider } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, score, total, responses } = location.state || { userName: "User", score: 0, total: 0, responses: [] };
  
  const [pastResults, setPastResults] = useState([]);

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("testResults")) || [];
    setPastResults(storedResults.reverse()); // Show the latest results first
  }, []);

  return (
    <Box p={6} textAlign="center">
      <Heading mb={4}>Test Completed!</Heading>
      <Text fontSize="xl" fontWeight="bold">
        {userName}, Your Score: {score} / {total}
      </Text>
      <Text mt={2} color={score > total / 2 ? "green.500" : "red.500"}>
        {score > total / 2 ? "Great job! Keep it up!" : "Keep practicing, you can improve!"}
      </Text>

      <Heading size="md" mt={6} mb={4}>Review Your Answers</Heading>
      <VStack spacing={3} align="start">
  {responses.map((response, index) => (
    <Box
      key={index}
      p={3}
      borderWidth="1px"
      borderRadius="md"
      w="100%"
      textAlign="left"
      bg={response.isCorrect ? "green.50" : "red.50"} // Highlight incorrect answers
    >
      <Text fontWeight="bold">{index + 1}. {response.question}</Text>
      <Text color={response.isCorrect ? "green.500" : "red.500"}>
        Your Answer: {response.selectedAnswer}
      </Text>
      {!response.isCorrect && (
        <Text color="blue.500">Correct Answer: {response.correctAnswer}</Text>
      )}
    </Box>
  ))}
</VStack>

      <Button mt={6} colorScheme="blue" onClick={() => navigate("/tests")}>
        Retake Test
      </Button>

      <Divider my={6} />

      <Heading size="md" mt={6} mb={4}>Past Test Results</Heading>
      <VStack spacing={3} align="start">
        {pastResults.length > 0 ? (
          pastResults.map((result, index) => (
            <Box key={index} p={3} borderWidth="1px" borderRadius="md" w="100%" textAlign="left">
              <Text fontWeight="bold">{result.userName}'s Test ({result.timestamp})</Text>
              <Text>Score: {result.score} / {result.total}</Text>
            </Box>
          ))
        ) : (
          <Text>No past test results found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Results;
