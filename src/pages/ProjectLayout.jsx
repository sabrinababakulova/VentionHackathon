import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { Box } from "@chakra-ui/react";

const ProjectLayout = () => {
  return (
    <>
      <SideBar />
      <Box ml={44} mr={4}>
        <Outlet />
      </Box>
    </>
  );
};

export default ProjectLayout;
