import React, { useEffect, useState } from "react";
import {
    Box, Heading, SimpleGrid, Card, CardBody, Text, Button, Input,
    IconButton, Flex, VStack, HStack, Image, useColorModeValue
} from "@chakra-ui/react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { mockQuestions } from "../data/mockQuestions";


// Hierarchical Test Data (with image and description added)
const testHierarchy = [
    {
        category: "BPSC Exam",
        image: "https://exampay.in/images/course/1583764471phpwh4xPd.jpeg", // Dummy image URL
        description: "Prepare for the BPSC Exam with various subcategories.",
        subcategories: [
            {
                name: "BPSC Teacher TRE 4.0",
                image: "https://exampay.in/images/course/1583764471phpwh4xPd.jpeg", // Dummy image URL
                description: "Focus on teaching methodology and pedagogy.",
                tests: [
                    { id: 4, name: "Computer Fundamental" },
                    { id: 5, name: "Programming (C, C++, Java, Python)" },
                    { id: 6, name: "Data Structures & Algorithms" },
                    { id: 7, name: "Database Management System" },
                    { id: 8, name: "Networking & Security" },
                    { id: 9, name: "Software Engineering & SDLC" },
                    { id: 12, name: "Teaching Methodology & Pedagogy" },
                    { id: 13, name: "General Awareness & Aptitude" },
                    { id: 14, name: "हिंदी भाषा" },
                ],
            },
        ],
    },
    {
        category: "Railway Exam",
        image: "https://www.pngfind.com/pngs/m/459-4595601_indian-railways-logo-south-central-railway-indian-indian.png", // Dummy image URL
        description: "Prepare for various Railway exams.",
        subcategories: [
            {
                name: "Railway Group D",
                image: "https://www.pngfind.com/pngs/m/459-4595601_indian-railways-logo-south-central-railway-indian-indian.png", // Dummy image URL
                description: "Prepare for the Railway Group D exam.",
                tests: [
                    { id: 15, name: "Mathematics" },
                    { id: 16, name: "Reasoning" },
                    { id: 17, name: "General Science" },
                    { id: 18, name: "Current Affairs" },
                ],
            },
        ],
    },
    {
        category: "Programming & Software",
        image: "https://miro.medium.com/v2/resize:fit:800/1*wcEYa9AjnMZxXAau2iuhYw.png", // Dummy image URL
        description: "Prepare for programming and software-related tests.",
        subcategories: [
            {
                name: "Software Testing",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIhpW4XrteLxojOCPgZFmbaxLm1kXxnlhQRRcjHkYOBYEzAl8PoYTnk2b7VB4lmIF3620&usqp=CAU", // Dummy image URL
                description: "Focus on manual and automated software testing.",
                tests: [
                    { id: 1, name: "Manual" },
                    { id: 2, name: "Automation (Selenium + Java)" },
                ],
            },
            {
                name: "Programming",
                image: "https://miro.medium.com/v2/resize:fit:800/1*wcEYa9AjnMZxXAau2iuhYw.png", // Dummy image URL
                description: "Prepare for programming languages and technologies.",
                tests: [
                    { id: 3, name: "Python - Entry Level" },
                    { id: 10, name: "Web Technologies (HTML, CSS, JavaScript, PHP)" },
                    { id: 11, name: "Artificial Intelligence & Machine Learning" },
                ],
            },
        ],
    },
    {
        category: "Miscellaneous",
        image: "https://png.pngtree.com/png-clipart/20230804/original/pngtree-test-orange-icon-sign-test-testing-vector-picture-image_9551097.png", // Dummy image URL
        description: "Miscellaneous tests for various purposes.",
        subcategories: [
            {
                name: "Test Only",
                image: "https://png.pngtree.com/png-clipart/20230804/original/pngtree-test-orange-icon-sign-test-testing-vector-picture-image_9551097.png", // Dummy image URL
                description: "Just for testing purposes.",
                tests: [
                    { id: 19, name: "Just For Test" },
                ],
            },
        ],
    },
];

const Tests = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getTestDetails = (testId) => {
        const questions = mockQuestions[testId] || [];
        const duration = questions.length * 2;
        return {
            questions: questions.length,
            duration: questions.length > 0 ? `${duration} mins` : "N/A",
        };
    };

    const filteredTests = selectedSubcategory
        ? selectedSubcategory.tests.filter((test) =>
            test.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null);
    };

    const handleSubcategoryClick = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const handleBack = () => {
        if (selectedSubcategory) {
            setSelectedSubcategory(null);
        } else {
            setSelectedCategory(null);
        }
    };

    return (
        <Box p={6}>
            <VStack align="stretch" spacing={2}>
                <Flex justify="space-between" align="center">
                    <Heading size="lg">
                        {selectedSubcategory
                            ? `Tests - ${selectedSubcategory.name}`
                            : selectedCategory
                                ? `Select the Exam for ${selectedCategory.category}`
                                : "Select a Exam"}
                    </Heading>

                    {isMobile && (
                        <IconButton
                            icon={showSearch ? <FaTimes /> : <FaSearch />}
                            onClick={() => setShowSearch(!showSearch)}
                            aria-label="Toggle Search"
                        />
                    )}
                </Flex>

                {isMobile && showSearch && selectedSubcategory && (
                    <Input
                        placeholder="Search for a test..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}

                {!isMobile && selectedSubcategory && (
                    <Input
                        placeholder="Search for a test..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        width="250px"
                    />
                )}
            </VStack>

            {selectedSubcategory || selectedCategory ? (
                <IconButton
                    mt={4}
                    onClick={handleBack}
                    colorScheme="gray"
                    size="sm"
                    icon={<ArrowBackIcon />}
                    aria-label="Back"
                />
            ) : null}

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                {!selectedCategory &&
                    testHierarchy.map((cat, idx) => (
                        <Card
                            key={idx}
                            onClick={() => handleCategoryClick(cat)}
                            cursor="pointer"
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "lg",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Flex direction="row" height="200px">
                                {/* Image section (50%) */}
                                <Box width="50%">
                                    <Image
                                        src={cat.image}
                                        alt={cat.category}
                                        objectFit="cover"
                                        height="100%"
                                        width="100%"
                                        borderRadius="md"
                                    />
                                </Box>

                                {/* Text section (50%) */}
                                <Box width="50%" p={3}>
                                    <Heading size="md" mb={2}>
                                        {cat.category}
                                    </Heading>
                                    <Text noOfLines={3} fontSize="sm">
                                        {cat.description}
                                    </Text>
                                </Box>
                            </Flex>
                        </Card>
                    ))}

                {selectedCategory && !selectedSubcategory &&
                    selectedCategory.subcategories.map((sub, idx) => (
                        <Card
                            key={idx}
                            onClick={() => handleSubcategoryClick(sub)}
                            cursor="pointer"
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "lg",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Flex direction="row" height="200px">
                                {/* Image section (50%) */}
                                <Box width="50%">
                                    <Image
                                        src={sub.image}
                                        alt={sub.name}
                                        objectFit="cover"
                                        height="100%"
                                        width="100%"
                                        borderRadius="md"
                                    />
                                </Box>

                                {/* Text section (50%) */}
                                <Box width="50%" p={3}>
                                    <Heading size="md" mb={2}>
                                        {sub.name}
                                    </Heading>
                                    <Text noOfLines={3} fontSize="sm">
                                        {sub.description}
                                    </Text>
                                </Box>
                            </Flex>
                        </Card>
                    ))}

                {selectedSubcategory &&
                    filteredTests.map((test) => {
                        const details = getTestDetails(test.id);
                        return (
                            <Card key={test.id} shadow="md" borderRadius="lg">
                                <CardBody>
                                    <Heading size="md">{test.name}</Heading>
                                    <Text mt={2}><b>Duration:</b> {details.duration}</Text>
                                    <Text><b>Questions:</b> {details.questions}</Text>
                                    <Button
                                        mt={4}
                                        colorScheme="blue"
                                        onClick={() =>
                                            navigate(`/test-attempt/${test.id}/${encodeURIComponent(test.name)}`)
                                        }
                                    >
                                        Start Test
                                    </Button>
                                </CardBody>
                            </Card>
                        );
                    })}
            </SimpleGrid>
        </Box>
    );
};

export default Tests;
