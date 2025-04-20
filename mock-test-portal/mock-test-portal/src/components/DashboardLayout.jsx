import React, { useState } from "react";
import {
    Box, VStack, IconButton, Drawer, DrawerOverlay, DrawerContent,
    DrawerCloseButton, Flex, Text, useDisclosure
} from "@chakra-ui/react";
import { FaBars, FaHome, FaClipboardList, FaChartBar, FaUser, FaTrophy } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

/* Sidebar Link Component */
const NavItem = ({ to, icon, label, onClose }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <NavLink to={to} style={{ width: "100%" }} onClick={onClose}>
            <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius="md"
                bg={isActive ? "white" : "transparent"}
                color={isActive ? "black" : "white"}
                _hover={{ bg: isActive ? "white" : "gray.700" }} // No hover for active links
            >
                <Box as={icon} mr={2} />
                {label}
            </Box>
        </NavLink>
    );
};

/* Sidebar */
const SidebarContent = ({ onClose }) => (
    <VStack spacing={4} align="start" p={5} mt="10px" w="200px">
        <Text fontSize={{ base: "md", lg: "xl" }} fontWeight="bold" color="white">
            🏆 Mock Test Portal
        </Text>
        <NavItem to="/dashboard" icon={FaHome} label="Home" onClose={onClose} />
        <NavItem to="/tests" icon={FaClipboardList} label="Tests" onClose={onClose} />
        <NavItem to="/results" icon={FaChartBar} label="Results" onClose={onClose} />
        <NavItem to="/profile" icon={FaUser} label="Profile" onClose={onClose} />
         {/* Logout Button */}
         <LogoutButton /> {/* 👈 Add this below navigation items */}
       {/* <NavItem to="/leaderboard" icon={FaTrophy} label="Leaderboard" onClose={onClose} />*/}
    </VStack>
);

/* Dashboard Layout */
const DashboardLayout = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Box minH="100vh" display="flex">
            {/* Sidebar */}
            {isMobile ? (
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg="gray.900">
                        <DrawerCloseButton color="white" />
                        <SidebarContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Box
                    h="100vh"
                    bg="gray.900"
                    color="white"
                    p={5}
                    position="fixed"
                    left="0"
                    top="0"
                    zIndex="1000"
                >
                    <SidebarContent />
                </Box>
            )}

            {/* Main Content Area */}
            <Box 
                flex="1"
                ml={isMobile ? "0" : "250px"} 
                p={{ base: "0px", md: "20px" }} 
                mt={{ base: "50px", md: "0px" }}
                w="calc(100% - 250px)" // Ensure proper width
            >
                {/* Mobile Header */}
                {isMobile && (
                    <Flex
                        bg="gray.900"
                        color="white"
                        p={4}
                        align="center"
                        position="fixed"
                        w="100%"
                        zIndex="banner"
                        top="0"
                    >
                        <IconButton
                            icon={<FaBars />}
                            bg="gray.900"
                            color="white"
                            size="lg"
                            borderRadius="md"
                            _hover={{ bg: "gray.700" }}
                            onClick={onOpen}
                        />
                        <Text fontSize="xl" color="white" fontWeight="bold" textAlign="center" flex="1">
                            🏆 Mock Test Portal
                        </Text>
                    </Flex>
                )}

                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
