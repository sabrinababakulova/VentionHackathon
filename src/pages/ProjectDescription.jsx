import React from "react";
import {
  Flex,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Center,
  Spinner,
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

  if (isLoading || !data) {
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
            <Input placeholder="Project Name" value={data?.name} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel mb={0}>Client's Name</FormLabel>
            <Input
              placeholder="Client's Name"
              value={data?.clientName}
              readOnly
            />
          </FormControl>
        </Flex>
        <FormControl>
          <FormLabel mb={0}>Description</FormLabel>
          <Textarea
            placeholder="Description"
            value={data?.description}
            readOnly
          />
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
        </Flex>
        <FormControl>
          <FormLabel mb={0}>Term of a project</FormLabel>
          <Flex gap={2} w="300px">
            <Input
              placeholder="Number"
              value={data?.monthsNeeded + " months"}
            />
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel mb={0}>Users</FormLabel>
          <Flex gap={2} w="300px">
            {data?.members?.$values?.map((user) => (
              <Input placeholder="User" value={user?.fullName} readOnly />
            ))}
          </Flex>
        </FormControl>
      </VStack>
    </>
  );
};

export default ProjectDescription;
