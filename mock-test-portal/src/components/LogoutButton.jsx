// src/components/LogoutButton.jsx
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });

    navigate("/"); // This takes user back to Auth.jsx
  };

  return (
    <Button colorScheme="red" size="sm" mt={4} onClick={handleLogout} width="100%">
      Logout
    </Button>
  );
};

export default LogoutButton;
