import React, { useState } from "react";
import {
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Badge,
  Textarea,
} from "@chakra-ui/react";
import { ModalWindow } from "./Modal";
import { FileInput } from "./FileUpload";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProjectPreview } from "./ProjectPreview";
import { apiClient } from "../apiClient";
import { useQuery } from "@tanstack/react-query";

export const TableRow = ({ id, items }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const email = localStorage.getItem("email");
  const [summary, setSummary] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [techSpecialist, setTechSpecialist] = useState("");
  const [term, setTerm] = useState("");
  const [error, setError] = useState("");

  const getTechLeads = async () => {
    try {
      const { data } = await apiClient.get("/techleads");
      return data;
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };
  const { data } = useQuery({
    queryKey: ["tech"],
    queryFn: getTechLeads,
    staleTime: Infinity,
  });

  const handleSubmit = async () => {
    if (
      !projectName ||
      !clientName ||
      !description ||
      !techSpecialist ||
      !term ||
      !summary ||
      !transcript
    ) {
      setError("Please fill all fields");
    }
    try {
      const formData = new FormData();
      formData.append("Name", projectName);
      formData.append("ClientName", clientName);
      formData.append("Description", description);
      formData.append("TechLeadId", techSpecialist);
      formData.append("MonthsNeeded", term);
      formData.append("Summary", summary);
      formData.append("Transcript", transcript);

      await apiClient.post("/projects", formData);
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.error(error);
    }
  };

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <VStack ref={setNodeRef}>
        {items.map((item) => (
          <ProjectPreview id={item} key={item} />
        ))}
        {id === "Negotiation Phase" && (
          <ModalWindow
            key="asdfasd"
            btnText="Create project"
            title="Create Project"
            onAccept={handleSubmit}
            acceptText="Create"
          >
            <VStack gap={3} key="asdfasdf">
              <Flex w="100%" gap="5">
                <FormControl>
                  <FormLabel mb={0}>Project Name</FormLabel>
                  <Input
                    placeholder="Enter project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={0}>Client's Name</FormLabel>
                  <Input
                    placeholder="Enter client's Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel mb={0}>Description</FormLabel>
                <Textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <Flex w="100%" gap="5">
                <FormControl>
                  <FormLabel mb={0}>Sales Manager</FormLabel>
                  <Input placeholder="Sales Manager" readOnly value={email} />
                </FormControl>
                <FormControl>
                  <FormLabel mb={0}>Sales Manager</FormLabel>
                  <Select
                    onChange={(e) => setTechSpecialist(e.target.value)}
                    placeholder="Select Tech Specialist"
                  >
                    {data?.map((tech) => (
                      <option value={tech?.id}>{tech?.email}</option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel mb={0}>Term of a project</FormLabel>
                <Flex gap={2} w="300px">
                  <Input
                    type="number"
                    placeholder="Enter a number"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                  <Select placeholder="Select Period">
                    <option value="option1">Hours</option>
                    <option value="option2">Days</option>
                    <option value="option3">Months</option>
                  </Select>
                </Flex>
              </FormControl>
              {[summary, transcript]?.map((file) => (
                <Badge w="100%" p={2} key={file?.name}>
                  {file?.name}
                </Badge>
              ))}
              <Flex w="100%" gap={4}>
                <FileInput
                  setUploadedFile={setSummary}
                  restrictions={[".txt"]}
                  explanation="Please upload summary"
                />
                <FileInput
                  setUploadedFile={setTranscript}
                  restrictions={[".txt"]}
                  explanation="Please upload transcript"
                />
              </Flex>
            </VStack>
            {error && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </ModalWindow>
        )}
      </VStack>
    </SortableContext>
  );
};
