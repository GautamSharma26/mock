import React, { useEffect, useState } from "react";
import {
    Box, Heading, SimpleGrid, Card, CardBody, Text, Button, Input, 
    IconButton, Flex, VStack
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import search & close icons
import { useNavigate } from "react-router-dom";
import { mockQuestions } from "../data/mockQuestions"; // Ensure correct import

const mockTests = [
    { id: 1, name: "Software Testing - Manual"},
    { id: 2, name: "Software Testing - Automation (Selenium + Java)"},
    { id: 3, name: "Python - Entry Level"},
    { id: 4, name: "BPSC Teacher TRE 4.0 - Computer Fundamental"},
    { id: 5, name: "BPSC Teacher TRE 4.0 - Programming (C, C++, Java, Python)"},
    { id: 6, name: "BPSC Teacher TRE 4.0 - Data Structures & Algorithms"},
    { id: 7, name: "BPSC Teacher TRE 4.0 - Database Management System"},
    { id: 8, name: "BPSC Teacher TRE 4.0 - Networking & Security"},
    { id: 9, name: "BPSC Teacher TRE 4.0 - Software Engineering & SDLC"},
    { id: 10, name: "Web Technologies (HTML, CSS, JavaScript, PHP)"},
    { id: 11, name: "Artificial Intelligence & Machine Learning"},
    { id: 12, name: "BPSC Teacher TRE 4.0 - Teaching Methodology & Pedagogy"},
    { id: 13, name: "BPSC Teacher TRE 4.0 - General Awareness & Aptitude"},
    { id: 14, name: "BPSC Teacher TRE 4.0 - हिंदी भाषा"}
];

const Tests = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [updatedTests, setUpdatedTests] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showSearch, setShowSearch] = useState(false); // For mobile search toggle

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Calculate dynamic question count and duration
        const updatedTestList = mockTests.map((test) => {
            const testQuestions = mockQuestions[test.id] || []; // Get questions from mockQuestions.js
            const totalQuestions = testQuestions.length;
            const duration = totalQuestions * 2; // Each question takes 2 mins
            return {
                ...test,
                questions: totalQuestions || 0, // Ensure it doesn't break
                duration: totalQuestions > 0 ? `${duration} mins` : "N/A"
            };
        });

        setUpdatedTests(updatedTestList);
    }, []);

    const filteredTests = updatedTests.filter((test) =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box p={6}>
            {/* Header Section */}
            <VStack align="stretch" spacing={2}>
                <Flex justify="space-between" align="center">
                    <Heading size="lg">Available Mock Tests</Heading>

                    {/* Mobile: Toggle Search Box */}
                    {isMobile && (
                        <IconButton
                            icon={showSearch ? <FaTimes /> : <FaSearch />} // Toggle between search & close
                            onClick={() => setShowSearch(!showSearch)}
                            aria-label="Toggle Search"
                        />
                    )}
                </Flex>

                {/* Mobile Search Box Appears Below Header */}
                {isMobile && showSearch && (
                    <Flex align="center">
                        <Input
                            placeholder="Search for a mock test..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            flex="1"
                        />                       
                    </Flex>
                )}

                {/* Desktop: Search bar is always visible */}
                {!isMobile && (
                    <Input
                        placeholder="Search for a mock test..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        width="250px"
                    />
                )}
            </VStack>

            {/* Display Mock Tests */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                        <Card key={test.id} shadow="md" borderRadius="lg">
                            <CardBody>
                                <Heading size="md">{test.name}</Heading>
                                <Text mt={2}><b>Duration:</b> {test.duration}</Text>
                                <Text><b>Questions:</b> {test.questions}</Text>
                                <Button
                                    mt={4}
                                    colorScheme="blue"
                                    onClick={() => navigate(`/test-attempt/${test.id}/${encodeURIComponent(test.name)}`)}
                                >
                                    Start Test
                                </Button>
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <Text fontSize="lg" color="red.500" textAlign="center" mt={4}>
                        No Results Found
                    </Text>
                )}
            </SimpleGrid>
        </Box>
    );
};

export default Tests;
