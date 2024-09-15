import React, { useState } from "react";
import {
  Box,
  Flex,
  Textarea,
  Input,
  Badge,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { ModalWindow } from "../components/Modal";
import { FileInput } from "../components/FileUpload";

const Projects = () => {
  const [files, setFiles] = useState([]);
  const MOCK_PROJECTS = [];

  return (
    <Box px={4} w="100%">
      <Flex justifyContent="end" m={2}>
        <ModalWindow
          btnText="Create project"
          title="Create Project"
          onAccept={() => {}}
          acceptText="Create"
        >
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
                <Input type="number" placeholder="Enter a number" />
                <Select placeholder="Select Period">
                  <option value="option1">Hours</option>
                  <option value="option2">Days</option>
                  <option value="option3">Months</option>
                </Select>
              </Flex>
            </FormControl>
            {files.map((file) => (
              <Badge w="100%" p={2}>
                {file?.name}
              </Badge>
            ))}
            <FileInput setUploadedFile={setFiles} restrictions={[".txt"]} />
          </VStack>
        </ModalWindow>
      </Flex>
      <Flex flexWrap="wrap" h="100%" gap={4} w="100%">
        {MOCK_PROJECTS.length === 0 ? (
          <p>no proj</p>
        ) : (
          <>
            {MOCK_PROJECTS.map((item) => (
              <Box
                key={item}
                bg="white"
                w="300px"
                h="300px"
                rounded="xl"
                border="1px solid"
                borderColor="gray.300"
              >
                <Heading textAlign="center" fontSize="xl">
                  {item}
                </Heading>
              </Box>
            ))}
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Projects;
