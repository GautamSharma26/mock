import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout"; // Dashboard Wrapper
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Tests from "./pages/Tests";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import TestAttempt from "./pages/TestAttempt";
import Leaderboard from "./pages/Leaderboard";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme"; // Chakra UI theme

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} /> {/* Fix */}
      <Router>
        {/* 🔥 Always Wrap Pages with Sidebar */}
        <DashboardLayout>
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/" element={<Auth />} /> {/* Login Page */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test-attempt" element={<TestAttempt />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
