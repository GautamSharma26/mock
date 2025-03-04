import React, { useState } from "react";
import {
  Box, Input, Button, FormControl, FormLabel, Heading, Text,
  VStack, useToast, Link, useColorModeValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");

  // Predefined Dummy User
  const DUMMY_USER = {
    email: "test@example.com",
    password: "password123",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim input values to avoid issues
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    // Validation
    if (!trimmedEmail || !trimmedPassword || (!isLogin && !trimmedName)) {
      toast({
        title: "Error",
        description: "All fields are required!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isLogin) {
      // **Login Validation**: Check against dummy user
      if (trimmedEmail === DUMMY_USER.email && trimmedPassword === DUMMY_USER.password) {
        toast({
          title: "Login Successful",
          description: "Redirecting to Dashboard...",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate("/dashboard"); // Redirect to Dashboard
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // **Dummy Registration Success**
      toast({
        title: "Registration Successful",
        description: "You can now log in!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Clear form after registration
      setEmail("");
      setPassword("");
      setName("");
      setIsLogin(true); // Switch to login form
    }
  };

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      boxShadow="md"
      w={{ base: "90%", md: "400px" }}
      mx="auto"
      mt="10%"
      textAlign="center"
    >
      <Heading size="lg" color={textColor} mb={4}>
        {isLogin ? "Login to Your Account" : "Create an Account"}
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {!isLogin && (
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value.trimStart())}
              />
            </FormControl>
          )}

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trimStart())}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trimStart())}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isDisabled={!email || !password || (!isLogin && !name)}
          >
            {isLogin ? "Login" : "Register"}
          </Button>
        </VStack>
      </form>

      <Text mt={4}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link color="blue.500" cursor="pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </Link>
      </Text>
    </Box>
  );
};

export default Auth;
