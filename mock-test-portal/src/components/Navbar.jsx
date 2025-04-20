import React from "react";
import { Box, Flex, Text, Button, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";  // Import Navbar CSS

const Navbar = ({ isSidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box className="navbar" style={{ left: isMobile ? "0px" : isSidebarOpen ? "250px" : "0px" }}>
      <Flex alignItems="center" width="100%">
        <Text className="navbar-title">🏆 Mock Test Portal</Text>
        <Spacer />
        <Flex className="navbar-links">
          <Button as={Link} to="/" variant="ghost">Home</Button>
          <Button as={Link} to="/tests" variant="ghost">Tests</Button>
          <Button as={Link} to="/results" variant="ghost">Results</Button>
          <Button as={Link} to="/profile" variant="ghost">Profile</Button>
          <Button as={Link} to="/auth" colorScheme="teal" variant="ghost">
            Login / Register
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
