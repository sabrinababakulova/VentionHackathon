import React from "react";
import {
  Accordion,
  VStack,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Badge,
  Heading,
  Button,
  Flex,
  Checkbox,
  Text,
  Select,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { ModalWindow } from "../components/Modal";
import { useParams } from "react-router-dom";
import { apiClient, apiClientBlob } from "../apiClient";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";

const Ideas = () => {
  const { id } = useParams();
  const [error, setError] = React.useState("");
  const [ideaLoading, setIdeaLoading] = React.useState(false);
  const [pdw, setPdw] = React.useState(false);

  const getProjIdeas = async () => {
    try {
      const { data } = await apiClient.get("/api/idea/byproject/" + id);
      return data;
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["ideas", id],
    queryFn: getProjIdeas,
    staleTime: Infinity,
  });

  const handleClientApprove = async (ideaId) => {
    try {
      setIdeaLoading(true);
      const data = await apiClientBlob.put(
        `/api/idea/client-approve/${ideaId}`,
      );

      // Create a Blob from the binary array (this assumes the backend provides valid XLSX binary data)
      const blob = new Blob([data?.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a link element, set the download attribute, and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.xlsx"; // Set the filename for the download
      document.body.appendChild(a);
      a.click();

      // Clean up the DOM after the download is triggered
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setPdw(true);
      setIdeaLoading(false);
    } catch (er) {
      console.log(er);
      setIdeaLoading(false);
      setError("Something went wrong");
    }
  };
  const handleTechleadApprove = async (checked) => {
    if (!checked) {
      return;
    }
    try {
      await apiClient.put(`/api/idea/tech-lead-approve/${id}`);
    } catch (er) {
      setError("Something went wrong");
    }
  };

  if (pdw) {
    return (
      <Center>
        <Badge p={2} colorScheme="green">
          PDW Downloaded
        </Badge>
      </Center>
    );
  }

  if (isLoading || !data) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Flex justifyContent="space-between">
        <Heading color="#FF6A47">Generated Ideas</Heading>
        <Flex>
          <Button colorScheme="orange" ml={4} variant="outline">
            Transcript
          </Button>
          <Button colorScheme="orange" ml={4} variant="outline">
            Summary
          </Button>
        </Flex>
      </Flex>
      <Accordion defaultIndex={[0]} allowMultiple>
        {data?.$values.map((idea) => (
          <AccordionItem
            key={idea?.id}
            rounded="xl"
            border="1px solid"
            borderColor="gray.300"
            mt={4}
          >
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {idea?.name}
                </Box>
                <Select w="150px" mr={4} h={8}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Select>
                <ModalWindow
                  disabled={!idea?.techLeadApproved}
                  type="ideas"
                  title="Accept Idea"
                  onAccept={() => handleClientApprove(idea?.id)}
                  acceptText="Accept"
                  modalSize="xl"
                  isLoading={ideaLoading}
                >
                  {ideaLoading ? (
                    <Center h={40}>
                      <Text>Processing...</Text>
                      <Spinner />
                    </Center>
                  ) : (
                    <VStack gap={3} key="asdfasdf">
                      <Heading fontSize="xl" color="#FF6A47">
                        Are you sure you want to accept this idea?
                      </Heading>
                      <Text>
                        You will be redirected to PDW phase of the negotiation
                        process
                      </Text>
                    </VStack>
                  )}
                </ModalWindow>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>{idea?.description}</Text>
              <br />
              <hr />
              <br />
              {idea?.requirementQuestions?.split(",")?.map((req) => (
                <Text p={2}>{req}</Text>
              ))}
              <Checkbox
                isReadOnly={localStorage.getItem("role") !== "TechLead"}
                onChange={(e) => handleTechleadApprove(e.target.checked)}
                value={idea?.techLeadApproved}
                colorScheme="orange"
              >
                Techlead Approval
              </Checkbox>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Flex mt={4} w="100%" justifyContent="center">
        <Button bg="#FF6A47" colorScheme="orange">
          Generate more ideas
        </Button>
      </Flex>
    </Box>
  );
};

export default Ideas;
