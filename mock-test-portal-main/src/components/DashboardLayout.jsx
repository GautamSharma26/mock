import React, { useState } from "react";
import {
    Box, VStack, IconButton, Drawer, DrawerOverlay, DrawerContent,
    DrawerCloseButton, Flex, Text, useDisclosure
} from "@chakra-ui/react";
import { FaBars, FaHome, FaClipboardList, FaChartBar, FaUser, FaTrophy } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

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
                _hover={{ bg: "gray.700" }}
            >
                <Box as={icon} mr={2} />
                {label}
            </Box>
        </NavLink>
    );
};

/* Sidebar */
const SidebarContent = ({ onClose }) => (
    <VStack spacing={4} align="start" p={5} mt="10px">
        <Text fontSize={{ base: "md", lg: "xl" }} className="portal-title" fontWeight="bold">
            🏆 Mock Test Portal
        </Text>

        <NavItem to="/dashboard" icon={FaHome} label="Home" onClose={onClose} />
        <NavItem to="/tests" icon={FaClipboardList} label="Tests" onClose={onClose} />
        <NavItem to="/results" icon={FaChartBar} label="Results" onClose={onClose} />
        <NavItem to="/profile" icon={FaUser} label="Profile" onClose={onClose} />
        <NavItem to="/leaderboard" icon={FaTrophy} label="Leaderboard" onClose={onClose} />
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
            {/* Sidebar for Desktop */}
            {!isMobile && (
                <Box
                    w="250px"
                    h="100vh"
                    bg="gray.900"
                    color="white"
                    p={5}
                    position="fixed"
                    left="0"
                    top="0"
                >
                    <SidebarContent />
                </Box>
            )}

            {/* Sidebar for Mobile */}
            {isMobile && (
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent bg="gray.900">
                        <DrawerCloseButton color="white" />
                        <SidebarContent onClose={onClose} />
                    </DrawerContent>
                </Drawer>
            )}

            {/* Main Content Area */}
            <Box flex="1" ml={!isMobile ? "250px" : "0"} p={0} mt={{ base: "10px", md: "0px" }}>
                {/* Mobile Header with Toggle Button */}
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
                        <Text fontSize="xl" fontWeight="bold" textAlign="center" flex="1">
                            🏆 Mock Test Portal
                        </Text>
                    </Flex>
                )}

                {/* Render Page Content */}
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;
