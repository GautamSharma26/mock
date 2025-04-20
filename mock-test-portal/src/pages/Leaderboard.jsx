import React, { useState, useEffect } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Spinner, Badge, Text, useColorModeValue
} from "@chakra-ui/react";

const mockLeaderboardData = [
  { id: 1, name: "John Doe", score: 98, testsTaken: 5, lastAttempt: "2025-02-25" },
  { id: 2, name: "Jane Smith", score: 92, testsTaken: 4, lastAttempt: "2025-02-24" },
  { id: 3, name: "Alex Johnson", score: 88, testsTaken: 6, lastAttempt: "2025-02-23" },
  { id: 4, name: "Chris Evans", score: 85, testsTaken: 3, lastAttempt: "2025-02-22" },
  { id: 5, name: "Emma Watson", score: 82, testsTaken: 7, lastAttempt: "2025-02-21" },
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setLeaderboard(mockLeaderboardData);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Heading size="lg" textAlign="center" color={textColor} mb={5}>
        🏆 Leaderboard
      </Heading>

      {loading ? (
        <Spinner size="xl" color="blue.500" display="block" mx="auto" />
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Name</Th>
                <Th>Score</Th>
                <Th>Tests Taken</Th>
                <Th>Last Attempt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leaderboard.map((user, index) => (
                <Tr key={user.id}>
                  <Td>
                    <Badge colorScheme={index === 0 ? "yellow" : "blue"} px={2} py={1}>
                      {index + 1}
                    </Badge>
                  </Td>
                  <Td>{user.name}</Td>
                  <Td fontWeight="bold" color="blue.600">
                    {user.score}
                  </Td>
                  <Td>{user.testsTaken}</Td>
                  <Td>
                    <Text fontSize="sm" color="gray.500">
                      {user.lastAttempt}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Leaderboard;
