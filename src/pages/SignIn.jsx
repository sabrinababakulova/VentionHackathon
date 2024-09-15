import React from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Image,
  Button,
  Checkbox,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import Logo from "../assets/logoOrange.png";
import { apiClient } from "../apiClient";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("Email", email);
      formData.append("Password", password);
      const { data } = await apiClient.post("/sign-in", formData);
      localStorage.setItem("email", email);
      localStorage.setItem("accessToken", data?.result?.accessToken);
      navigate("/"); // Redirect to home page
    } catch (er) {
      setError("Invalid email or password");
    }
  };
  return (
    <Flex flexDir="column" w="100%" h="100vh" alignItems="center">
      <Box>
        <Image width={56} height={52} src={Logo} />
      </Box>
      <Box w="400px" border="1px solid #FF6A47" rounded="xl" p={8}>
        <Heading w="100%" textAlign="center" color="#FF6A47">
          Log in
        </Heading>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          onClick={handleLogin}
          mt={4}
          colorScheme="orange"
          bg="#FF6A47"
          color="white"
          w="100%"
        >
          LOG IN
        </Button>
        <Checkbox mt={4} colorScheme="orange">
          Remember me
        </Checkbox>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Box>
    </Flex>
  );
};

export default SignIn;
