import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { apiClient } from "../apiClient";
import { Box, Center, Spinner } from "@chakra-ui/react";

const Docs = () => {
  const { id } = useParams();
  const getProjects = async () => {
    try {
      const { data } = await apiClient.get(`/projects/${id}`);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: getProjects,
    staleTime: Infinity,
  });

  if (isLoading || !data) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <Box>
      <div>{data?.find((item) => item?.id === id)?.summary?.name || "Summary first meeting"}</div>
      <div>{data?.find((item) => item?.id === id)?.transcript?.name || "Transcript first meeting"}</div>
    </Box>
  );
};

export default Docs;
