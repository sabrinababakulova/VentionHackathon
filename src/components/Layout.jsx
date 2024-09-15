import React, { useEffect } from "react";
import { chakra, Box } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";

export const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/sign-in");
    }
  }, []);

  return (
    <chakra.main>
      <chakra.div>
        <Header />
        <Box w="100%">
          <Outlet />
        </Box>
      </chakra.div>
    </chakra.main>
  );
};
