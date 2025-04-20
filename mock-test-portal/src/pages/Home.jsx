import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue
} from "@chakra-ui/react";
import DashboardCharts from "../components/DashboardCharts"; // ✅ Chart section import

const Home = () => {
    const [testStats, setTestStats] = useState({ totalTests: 0, avgScore: 0, bestScore: 0 });
    const [pastResults, setPastResults] = useState([]);

    useEffect(() => {
        const results = JSON.parse(localStorage.getItem("testResults")) || [];
        setPastResults(results);

        const totalTests = results.length;
        const totalScore = results.reduce((sum, test) => sum + test.score, 0);
        const bestScore = results.reduce((max, test) => Math.max(max, test.score), 0);
        const avgScore = totalTests > 0 ? (totalScore / totalTests).toFixed(1) : 0;

        setTestStats({ totalTests, avgScore, bestScore });

        // Alert if it's been more than 3 days since last test
        if (results.length > 0) {
            const lastTestDate = new Date(results[results.length - 1].timestamp);
            const daysSinceLastTest = (new Date() - lastTestDate) / (1000 * 60 * 60 * 24);
            if (daysSinceLastTest > 3) {
                alert("It's been a while since your last test! Keep practicing.");
            }
        }
    }, []);

    return (
        <Box p={6}>
            <Heading mb={4} color="white">Dashboard</Heading>

            {/* Stat Boxes */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <StatBox label="Total Tests Taken" value={testStats.totalTests} />
                <StatBox label="Average Score" value={`${testStats.avgScore} / 3`} />
                <StatBox label="Best Score" value={`${testStats.bestScore} / 3`} />
            </SimpleGrid>

            {/* Chart Section with dynamic data */}
            <DashboardCharts testResults={pastResults} />
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
