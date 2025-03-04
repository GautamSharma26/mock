import React, { useEffect, useState } from "react";
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from "@chakra-ui/react";

const Home = () => {
    const [testStats, setTestStats] = useState({ totalTests: 0, avgScore: 0, bestScore: 0 });

    useEffect(() => {
        const pastResults = JSON.parse(localStorage.getItem("testResults")) || [];
        const totalTests = pastResults.length;
        const totalScore = pastResults.reduce((sum, test) => sum + test.score, 0);
        const bestScore = pastResults.reduce((max, test) => Math.max(max, test.score), 0);
        const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(1) : 0;

        setTestStats({ totalTests, avgScore, bestScore });

        // Check last test date
        if (pastResults.length > 0) {
            const lastTestDate = new Date(pastResults[pastResults.length - 1].timestamp);
            const daysSinceLastTest = (new Date() - lastTestDate) / (1000 * 60 * 60 * 24);

            if (daysSinceLastTest > 3) {
                alert("It's been a while since your last test! Keep practicing.");
            }
        }
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4}>Dashboard</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <StatBox label="Total Tests Taken" value={testStats.totalTests} />
                <StatBox label="Average Score" value={`${testStats.avgScore} / 3`} />
                <StatBox label="Best Score" value={`${testStats.bestScore} / 3`} />
            </SimpleGrid>
        </Box>
    );
};

const StatBox = ({ label, value }) => (
    <Box
        p={5}
        borderWidth="1px"
        borderRadius="md"
        textAlign="center"
        bg={useColorModeValue("gray.100", "gray.700")} // Adjust background based on theme
        color={useColorModeValue("black", "white")}  // Adjust text color based on theme
    >
        <Stat>
            <StatLabel>{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
        </Stat>
    </Box>
);

export default Home;
