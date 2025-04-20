import React from "react";
import {
    Box,
    SimpleGrid,
    Text,
    Progress,
    useColorModeValue,
    VStack,
    HStack,
} from "@chakra-ui/react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

// Pie colors
const COLORS = ["#FF8042", "#00C49F", "#FFBB28", "#0088FE"];
const subjectScoresMap = {};



// Prepare data for chart
const subjectScoreData = Object.entries(subjectScoresMap).map(([subject, scores]) => ({
    subject,
    avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
}));

const DashboardCharts = ({ testResults }) => {
    const bgColor = useColorModeValue("white", "#2d3748");
    const textColor = useColorModeValue("gray.800", "white");

    if (!testResults || testResults.length === 0) {
        return (
            <Box p={6} textAlign="center" color="gray.500">
                No test results available to display charts.
            </Box>
        );
    }

    const barData = testResults.map((result, index) => ({
        name: `Test ${index + 1}`,
        score: result.score,
    }));

    // Pie data: group by rounded scores
    const scoreDistribution = [...new Set(testResults.map(r => r.total))].flatMap(total =>
        [0, 1, 2, 3].map(score => {
            const count = testResults.filter(
                (r) => Math.round((r.score / r.total) * 3) === score && r.total === total
            ).length;
            return count > 0 ? { name: `Score ${score} (${total} Qs)`, value: count } : null;
        }).filter(Boolean)
    );

    // Score Summary (using average of normalized scores per total)
    const groupedByTotal = testResults.reduce((acc, curr) => {
        const key = curr.total;
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr.score);
        return acc;
    }, {});

    const scoreSummary = Object.entries(groupedByTotal).map(([total, scores]) => {
        const totalNum = parseInt(total);
        const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        const best = Math.max(...scores);
        return {
            total: totalNum,
            avg,
            best,
        };
    });

    return (
        <VStack spacing={6} align="stretch" mt={10}>
            {/* Bar Chart */}
            <Box bg={bgColor} p={4} borderRadius="xl" boxShadow="md">
                <Text mb={3} fontSize="lg" fontWeight="bold" color={textColor}>
                    Test Scores Over Time
                </Text>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                        <XAxis dataKey="name" stroke={textColor} />
                        <YAxis stroke={textColor} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#00BFFF" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Pie Chart */}
            <Box bg={bgColor} p={4} borderRadius="xl" boxShadow="md">
                <Text mb={3} fontSize="lg" fontWeight="bold" color={textColor}>
                    Score Distribution
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={scoreDistribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            label
                        >
                            {scoreDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Box>

            {/* Score Summary by Subject */}
            <Box bg={bgColor} p={4} borderRadius="xl" boxShadow="md">
                <Text mb={3} fontSize="lg" fontWeight="bold" color={textColor}>
                    Score Summary by Subject
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={subjectScoreData}>
                        <XAxis dataKey="subject" stroke={textColor} />
                        <YAxis domain={[0, 3]} stroke={textColor} />
                        <Tooltip />
                        <Bar dataKey="avgScore" fill="#FF8042" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            {/* Recent Tests */}
            <Box bg={bgColor} p={4} borderRadius="xl" color={textColor} boxShadow="md">
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                    Recent Tests
                </Text>
                <VStack align="start" spacing={2}>
                    {testResults.slice(-5).reverse().map((result, index) => (
                        <Box key={index}>
                            <Text fontWeight="semibold">
                                {result.testName || "Untitled Test"} — {result.score} / {result.total}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                                {result.timestamp}
                            </Text>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
};

export default DashboardCharts;
