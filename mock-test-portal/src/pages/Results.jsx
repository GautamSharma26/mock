import React, { useRef, useState, useEffect } from "react";
import {
  Box, Heading, Text, Button, VStack, Divider, useColorModeValue,
  Link, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure, useToast
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useRef();
  const toast = useToast();

  const {
    userName,
    score,
    total,
    responses,
    testName,
    timestamp
  } = location.state || {
    userName: "User",
    score: 0,
    total: 0,
    responses: [],
    testName: "Unknown Test",
    timestamp: new Date().toLocaleString()
  };

  const [pastResults, setPastResults] = useState([]);

  const questionTextColor = useColorModeValue("gray.800", "gray.200");
  const correctAnswerBg = useColorModeValue("green.50", "green.900");
  const incorrectAnswerBg = useColorModeValue("red.50", "red.900");

  // ✅ Store and load results from localStorage (prevent duplicates)
  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("testResults")) || [];

    // Skip saving if testName is unknown or score data is invalid
    if (testName === "Unknown Test" || !userName || total === 0) {
      setPastResults(storedResults.reverse());
      return;
    }

    const isDuplicate = storedResults.some(
      (r) =>
        r.userName === userName &&
        r.testName === testName &&
        r.timestamp === timestamp
    );

    if (!isDuplicate) {
      const newResult = { userName, score, total, testName, timestamp };
      const updatedResults = [...storedResults, newResult];
      localStorage.setItem("testResults", JSON.stringify(updatedResults));
      setPastResults(updatedResults.reverse());
    } else {
      setPastResults(storedResults.reverse());
    }
  }, [userName, score, total, testName, timestamp]);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_3auufg8",
        "template_9hyy3ko",
        form.current,
        "rXtrcX9RwBXaEwCT8"
      )
      .then(
        (response) => {
          toast({
            title: "Feedback Sent",
            description: "Your feedback has been sent successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        },
        (error) => {
          toast({
            title: "Failed to Send Feedback",
            description: "An error occurred while sending your feedback. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      );
  };

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
            bg={response.isCorrect ? correctAnswerBg : incorrectAnswerBg}
          >
            <Text fontWeight="bold" color={questionTextColor}>
              {index + 1}. {response.question}
            </Text>
            <Text color={response.isCorrect ? "green.500" : "red.500"}>
              Your Answer: {response.selectedAnswer}
            </Text>
            {!response.isCorrect && (
              <Text color="blue.500">Correct Answer: {response.correctAnswer}</Text>
            )}
          </Box>
        ))}
      </VStack>

      <Text mt={4} fontSize="sm" color="gray.500">
        If you find any incorrect answer that you believe is correct, you can{" "}
        <Link color="blue.500" onClick={onOpen}>
          Share Feedback
        </Link>.
      </Text>

      <Button mt={6} colorScheme="blue" onClick={() => navigate("/tests")}>
        Retake Test
      </Button>

      <Divider my={6} />

      <Heading size="md" mt={6} mb={4}>Past Test Results</Heading>
      <VStack spacing={3} align="start">
        {pastResults.length > 0 ? (
          pastResults.map((result, index) => (
            <Box key={index} p={3} borderWidth="1px" borderRadius="md" w="100%" textAlign="left">
              <Text fontWeight="bold">{result.userName}'s Test - {result.testName} ({result.timestamp})</Text>
              <Text>Score: {result.score} / {result.total}</Text>
            </Box>
          ))
        ) : (
          <Text>No past test results found.</Text>
        )}
      </VStack>

      {/* Feedback Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Feedback</ModalHeader>
          <ModalBody>
            <form ref={form} onSubmit={sendEmail}>
              <VStack spacing={4}>
                <Input
                  placeholder="Your Name"
                  name="user_name"
                  required
                />
                <Textarea
                  placeholder="Enter your feedback here..."
                  name="message"
                  required
                />
              </VStack>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Submit
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Results;
