import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Input,
    Button,
    VStack,
    Text,
    Select,
    Switch,
    useColorMode,
} from "@chakra-ui/react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
    const { colorMode, toggleColorMode } = useColorMode(); // Theme Toggle
    const [userName, setUserName] = useState("");
    const [preference, setPreference] = useState("");
    const [testStats, setTestStats] = useState({ totalTests: 0, correct: 0, incorrect: 0 });
    const getAchievements = (bestScore) => {
        if (bestScore >= 3) return "🏅 Master Achiever";
        if (bestScore === 2) return "🥈 Rising Star";
        if (bestScore === 1) return "🥉 Beginner Explorer";
        return "🔰 New Learner";
    };
    const [achievement, setAchievement] = useState(""); // Fix: Define achievement state

    useEffect(() => {
        // Load saved profile data
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (savedProfile) {
            setUserName(savedProfile.userName || "");
            setPreference(savedProfile.preference || "");
        }

        // Load test history stats
        const pastResults = JSON.parse(localStorage.getItem("testResults")) || [];
        const totalTests = pastResults.length;
        const correctAnswers = pastResults.reduce((sum, test) => sum + test.score, 0);
        const incorrectAnswers = totalTests * 3 - correctAnswers; // Assuming 3 questions per test
        const bestScore = pastResults.reduce((max, test) => Math.max(max, test.score), 0);

        setTestStats({ totalTests, correct: correctAnswers, incorrect: incorrectAnswers });
        setAchievement(getAchievements(bestScore));
    }, []);

    const handleSaveProfile = () => {
        const profileData = { userName, preference };
        localStorage.setItem("userProfile", JSON.stringify(profileData));
        alert("Profile updated successfully!");
    };

    const handleResetHistory = () => {
        localStorage.removeItem("testResults");
        setTestStats({ totalTests: 0, correct: 0, incorrect: 0 });
        alert("Test history cleared!");
    };

    // Chart Data (Smaller Size)
    const chartData = {
        labels: ["Correct Answers", "Incorrect Answers"],
        datasets: [
            {
                data: [testStats.correct, testStats.incorrect],
                backgroundColor: ["#4CAF50", "#FF5733"],
            },
        ],
    };

    // Performance Feedback
    const getPerformanceFeedback = () => {
        if (testStats.totalTests === 0) {
            return "You haven't taken any tests yet. Start now!";
        } else if (testStats.correct / (testStats.correct + testStats.incorrect) > 0.7) {
            return "Great job! You're performing well!";
        } else {
            return "Keep practicing to improve your performance!";
        }
    };

    return (
        <Box p={6} textAlign="center">
            <Heading mb={4}>Profile</Heading>
            <Heading mt={6} size="md">Your Achievement</Heading>
            <Text fontSize="xl" fontWeight="bold" mt={2}>{achievement}</Text>

            {/* Theme Toggle */}
            <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
                <Text mr={2}>Light Mode</Text>
                <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
                <Text ml={2}>Dark Mode</Text>
            </Box>

            <VStack spacing={4} align="center">
                <Input
                    placeholder="Enter Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    size="lg"
                />

                <Select
                    placeholder="Select Preference"
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                </Select>

                <Button colorScheme="blue" onClick={handleSaveProfile}>
                    Save Profile
                </Button>
            </VStack>

            <Heading mt={6} size="md">Test Performance</Heading>
            {testStats.totalTests > 0 ? (
                <>
                    <Box width="200px" mx="auto">
                        <Pie data={chartData} /> {/* Smaller Chart */}
                    </Box>
                    <Text mt={4} fontSize="lg">{getPerformanceFeedback()}</Text>
                </>
            ) : (
                <Text mt={4}>No test data available yet.</Text>
            )}

            {/* Reset Test History */}
            {testStats.totalTests > 0 && (
                <Button mt={6} colorScheme="red" onClick={handleResetHistory}>
                    Reset Test History
                </Button>
            )}
        </Box>
    );
};

export default Profile;
