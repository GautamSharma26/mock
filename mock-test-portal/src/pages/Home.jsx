import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Textarea,
    VStack,
    useDisclosure,
    useToast,
    Flex,
    ModalCloseButton,
} from "@chakra-ui/react";
import DashboardCharts from "../components/DashboardCharts"; // ✅ Chart section import
import emailjs from "@emailjs/browser"; // Import EmailJS

const Home = () => {
    const [testStats, setTestStats] = useState({ totalTests: 0, avgScore: 0, bestScore: 0 });
    const [pastResults, setPastResults] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const form = useRef(); // Use ref for the form
    const toast = useToast(); // Initialize Chakra UI toast

    useEffect(() => {
        const results = JSON.parse(localStorage.getItem("testResults")) || [];
        setPastResults(results);

        const totalTests = results.length;
        const totalScore = results.reduce((sum, test) => sum + test.score, 0);
        const bestScore = results.reduce((max, test) => Math.max(max, test.score), 0);
        const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(1) : 0;

        setTestStats({ totalTests, avgScore, bestScore });

        // Alert if it's been more than 10 days since last test
        if (results.length > 0) {
            const lastTestDate = new Date(results[results.length - 1].timestamp);
            const daysSinceLastTest = (new Date() - lastTestDate) / (1000 * 60 * 60 * 24);
            if (daysSinceLastTest > 10) {
                toast({
                    title: "Reminder",
                    description: "It's been a while since your last test! Keep practicing.",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_3auufg8", // Replace with your EmailJS service ID
                "template_9hyy3ko", // Replace with your EmailJS template ID
                form.current,
                "rXtrcX9RwBXaEwCT8" // Replace with your EmailJS public key
            )
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
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
                    console.error("FAILED...", error);
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
        <Box p={6}>
            <Flex justify="space-between" align="center" mb={4}>
                <Heading color="white">Dashboard</Heading>
                <Button colorScheme="blue" onClick={onOpen}>
                    Share Feedback
                </Button>
            </Flex>

            {/* Stat Boxes */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <StatBox label="Total Tests Taken" value={testStats.totalTests} />
                <StatBox label="Average Score" value={`${testStats.avgScore} / 3`} />
                <StatBox label="Best Score" value={`${testStats.bestScore} / 3`} />
            </SimpleGrid>

            {/* Chart Section with dynamic data */}
            <DashboardCharts testResults={pastResults} />

            {/* Feedback Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share Feedback</ModalHeader>
                    <ModalCloseButton /> {/* Close "X" button */}
                    <ModalBody>
                        <form ref={form} onSubmit={sendEmail}>
                            <VStack spacing={4}>
                                <Input
                                    placeholder="Your Name"
                                    name="user_name" // Name attribute for EmailJS
                                    required
                                />
                                <Textarea
                                    placeholder="Enter your feedback here..."
                                    name="message" // Name attribute for EmailJS
                                    required
                                />
                            </VStack>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} type="submit">
                                    Submit
                                </Button>
                                <Button variant="ghost" onClick={onClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const StatBox = ({ label, value }) => (
    <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        textAlign="center"
        bg={useColorModeValue("gray.100", "gray.700")}
        color={useColorModeValue("black", "white")}
    >
        <Stat>
            <StatLabel>{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
        </Stat>
    </Box>
);

export default Home;
