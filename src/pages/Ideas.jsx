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
import { apiClient, baseURL } from "../apiClient";
import { useQuery } from "@tanstack/react-query";

const Ideas = () => {
  const { id } = useParams();
  const [error, setError] = React.useState("");
  const [ideaLoading, setIdeaLoading] = React.useState(false);
  const [pdw, setPdw] = React.useState(false);

  const getProjIdeas = async () => {
    try {
      const { data } = await apiClient.get("/api/idea/byproject/" + id);

      if (data?.$values.find((idea) => idea?.clientApproved)) {
        setPdw(true);
      }
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
      await fetch(`${baseURL}/api/idea/client-approve/${ideaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `PDW_Report_${ideaId}.xlsx`; // Set the filename
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Error:", error));
      setPdw(true);
      setIdeaLoading(false);
    } catch (er) {
      console.log(er);
      setIdeaLoading(false);
      setError("Something went wrong");
    }
  };
  const handleTechleadApprove = async (checked, ideaId) => {
    if (!checked) {
      return;
    }
    try {
      await apiClient.put(`/api/idea/tech-lead-approve/${ideaId}`);
    } catch (er) {
      setError("Something went wrong");
    }
  };

  if (pdw) {
    return (
      <Center flexDir="column" gap={4}>
        <Badge p={2} colorScheme="green">
          PDW Downloaded
        </Badge>
      </Center>
    );
  }

  if (isLoading || !data) {
    return (
      <Center h="100vh">
        <Spinner  size="xl"/>
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
                    <Center h={40} flexDir="column" gap={4}>
                      <Text>Processing...</Text>
                      <Spinner size="xl" />
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
                onChange={(e) =>
                  handleTechleadApprove(e.target.checked, idea?.id)
                }
                defaultChecked={idea?.techLeadApproved}
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
