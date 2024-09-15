import React from "react";
import {
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Center,
  Spinner
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { useParams } from "react-router-dom";

const ProjectDescription = () => {
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

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <>
      <VStack gap={3}>
        <Flex w="100%" gap="5">
          <FormControl>
            <FormLabel mb={0}>Project Name</FormLabel>
            <Input placeholder="Project Name" />
          </FormControl>
          <FormControl>
            <FormLabel mb={0}>Project Name</FormLabel>
            <Input placeholder="Client's Name" />
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel mb={0}>Description</FormLabel>
          <Textarea placeholder="Description" />
        </FormControl>
        <Flex w="100%" gap="5">
          <FormControl>
            <FormLabel mb={0}>Sales Manager</FormLabel>
            <Input
              placeholder="Sales Manager"
              readOnly
              value="sabrina.babakulova@ventionteams.com"
            />
          </FormControl>
          <FormControl>
            <FormLabel mb={0}>Sales Manager</FormLabel>
            <Input placeholder="Tech Specialist" />
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel mb={0}>Term of a project</FormLabel>
          <Flex gap={2} w="300px">
            <Input placeholder="Number" />
          </Flex>
        </FormControl>
      </VStack>
    </>
  );
};

export default ProjectDescription;
