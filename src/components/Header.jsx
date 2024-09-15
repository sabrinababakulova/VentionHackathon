import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Image,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Logo from "../assets/logo.png";
import AI from "../assets/AI.png";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email")?.split(".")[0];

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    navigate("/sign-in");
  };

  return (
    <Flex bg="#FF6A47" p={5} justifyContent="space-between" w="100%" h="80px">
      <Flex onClick={() => navigate("/")} cursor="pointer">
        <Box position="absolute" top="16px">
          <Image width={24} height={20} src={Logo} />
        </Box>
        <Heading ml={16} color="white">
          Sally
        </Heading>
      </Flex>
      <Flex gap={3}>
        <Heading textTransform="capitalize">
          {email},
          <span style={{ color: "white" }}> welcome to our system!</span>
        </Heading>
        <Menu colorScheme="orange">
          <MenuButton>
            <Avatar name="Makhmood" src={AI} />
          </MenuButton>
          <MenuList>
            <MenuItem>HowTo</MenuItem>
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};
