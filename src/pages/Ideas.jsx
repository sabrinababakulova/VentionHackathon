import React from "react";
import {
  Accordion,
  VStack,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
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
import { apiClient } from "../apiClient";
import { useQuery } from "@tanstack/react-query";

const Ideas = () => {
  const { id } = useParams();
  const [state, setState] = React.useState("Pending");
  const [error, setError] = React.useState("");

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

  const handleClientApprove = async () => {
    try {
      await apiClient.put(`/api/idea/client-approve/${id}`);
      navigate("/");
    } catch (er) {
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

  if (isLoading) {
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
        <AccordionItem
          rounded="xl"
          border="1px solid"
          borderColor="gray.300"
          mt={4}
        >
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 1 title
              </Box>
              <Select
                bg={
                  state === "Pending"
                    ? "#FAEF5199"
                    : state === "Approved"
                      ? "#A3DE8FB2"
                      : "#E55555B2"
                }
                w="150px"
                mr={4}
                h={8}
                onChange={(e) => setState(e.target.value)}
                defaultValue={state}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>
              <ModalWindow
                type="ideas"
                title="Accept Idea"
                onAccept={handleClientApprove}
                acceptText="Accept"
                modalSize="xl"
              >
                <VStack gap={3} key="asdfasdf">
                  <Heading fontSize="xl" color="#FF6A47">
                    Are you sure you want to accept this idea?
                  </Heading>
                  <Text>
                    You will be redirected to PDW phase of the negotiation
                    process
                  </Text>
                </VStack>
              </ModalWindow>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. ea commodo
              consequat.
            </Text>
            <Checkbox
              isReadOnly={localStorage.getItem("role") !== "techlead"}
              onChange={(e) => handleTechleadApprove(e.target.checked)}
              colorScheme="orange"
            >
              Techlead Approval
            </Checkbox>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem
          rounded="xl"
          border="1px solid"
          borderColor="gray.300"
          mt={4}
        >
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. ea commodo
              consequat.
            </Text>
            <Checkbox
              onChange={(e) => (e.target.checked ? handleTechleadApprove : {})}
              colorScheme="orange"
            >
              Techlead Approval
            </Checkbox>
          </AccordionPanel>
        </AccordionItem>
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
