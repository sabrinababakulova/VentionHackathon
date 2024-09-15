import React, { useState } from "react";
import {
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  VStack,
  Center,
  Spinner,
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
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const TableRow = ({ id, items, projs }) => {
  const queryClient = useQueryClient();
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
  const [loading, setLoading] = useState(false);

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

      setLoading(true);
      await apiClient.post("/projects", formData);
      setLoading(false);
      queryClient.setQueryData(["projects"], (oldData) => {
        return [
          ...oldData,
          {
            name: projectName,
            users: null,
            state: 1,
            summary,
            transcript,
            id:
              oldData
                .map((item) => item.id)
                .sort((a, b) => a - b)
                .pop() + 1,
          },
        ];
      });
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
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
          <ProjectPreview projs={projs} item={item} key={item?.id} />
        ))}
        {id === "Negotiation Phase" && (
          <ModalWindow
            key="asdfasd"
            btnText="Create project"
            title="Create Project"
            onAccept={handleSubmit}
            acceptText="Create"
            isLoading={loading}
          >
            {loading ? (
              <Center h={40}>
                <Spinner />
              </Center>
            ) : (
              <>
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
                      <Input
                        placeholder="Sales Manager"
                        readOnly
                        value={email}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel mb={0}>Sales Manager</FormLabel>
                      <Select
                        onChange={(e) => setTechSpecialist(e.target.value)}
                        placeholder="Select Tech Specialist"
                      >
                        {data?.$values?.map((tech) => (
                          <option value={tech?.id}>{tech?.email}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Flex>
                  <FormControl>
                    <FormLabel mb={0}>Term of a project</FormLabel>
                    <Flex gap={2} w="350px">
                      <Input
                        type="number"
                        placeholder="Enter a number"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                      />
                      <Select placeholder="Select Period" defaultValue="months">
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                      </Select>
                    </Flex>
                  </FormControl>
                  {[summary, transcript]?.map((file) => (
                    <Badge w="100%" p={2} key={file?.name}>
                      {file?.name}
                    </Badge>
                  ))}
                  <Flex w="100%" gap={4} flexDir={["column", "row"]}>
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
              </>
            )}
          </ModalWindow>
        )}
      </VStack>
    </SortableContext>
  );
};
