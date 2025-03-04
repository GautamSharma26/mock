import React from "react";
import { Box, Heading, SimpleGrid, Card, CardBody, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Add this line

const mockTests = [
    { id: 1, name: "Mathematics Mock Test", duration: "60 mins", questions: 50 },
    { id: 2, name: "Science Mock Test", duration: "45 mins", questions: 40 },
    { id: 3, name: "History Mock Test", duration: "30 mins", questions: 30 },
    { id: 4, name: "English Grammar Test", duration: "40 mins", questions: 35 },
];

const Tests = () => {
    const navigate = useNavigate();
    return (
        <Box p={6}>
            <Heading mb={4}>Available Mock Tests</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {mockTests.map((test) => (
                    <Card key={test.id} shadow="md" borderRadius="lg">
                        <CardBody>
                            <Heading size="md">{test.name}</Heading>
                            <Text mt={2}>Duration: {test.duration}</Text>
                            <Text>Questions: {test.questions}</Text>
                            <Button mt={4} colorScheme="blue" onClick={() => navigate("/test-attempt")}> Start Test </Button>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default Tests;
