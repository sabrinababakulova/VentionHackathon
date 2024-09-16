import React from "react";
import {
  Box,
  Flex,
  Heading,
  AvatarGroup,
  Avatar,
  Text,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { RiAttachmentFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {baseURL } from "../apiClient";
import { useState } from "react";
import { ModalWindow } from "./Modal";

export const ProjectPreview = ({ item, projs }) => {
  const [loading, setLoading] = useState(false);
  const correctProject = projs.find((proj) => proj.id === item);
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const downloadPDW = async () => {
    try {
      setLoading(true);
      await fetch(`${baseURL}/api/pdw/download-roadmap/${correctProject?.pdwId}`, {
        method: "GET",
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `ROADMAP_${correctProject?.pdwId}.xlsx`; // Set the filename
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Error:", error));
    } catch (er) {
      console.log(er);
    }
    setLoading(false);
  };
  return (
    <Flex
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      flexDirection="column"
      justifyContent="space-between"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      p={4}
      w="100%"
      h="120px"
    >
      <Flex justifyContent="space-between">
        <Box onClick={() => navigate(`/projects/${correctProject?.id}`)}>
          <Heading fontSize="md">{correctProject?.name}</Heading>
          <Text>{correctProject?.monthsNeeded} months</Text>
        </Box>
        {correctProject?.pdwId && (
          <ModalWindow
            type="roadmap"
            title="Downloading Roadmap"
            text="Roadmap"
            onAccept={downloadPDW}
            acceptText="Accept"
            modalSize="xl"
            isLoading={loading}
          >
            {loading ? (
              <Center h={40} flexDir="column" gap={4}>
                <Text color="#FFA47">Sally is preparing RoadMap...</Text>
                <Spinner size="xl"/>
              </Center>
            ) : (
              <Center h={40} flexDir="column" gap={4}>
                <Text>Download Roadmap</Text>
              </Center>
            )}
          </ModalWindow>
        )}
      </Flex>
      <Flex w="100%" justifyContent="space-between" gap={2}>
        <AvatarGroup size="xs" max={2}>
          {correctProject?.members &&
            correctProject?.members?.$values.map((user) => (
              <Avatar name={user?.fullName} bg="red" />
            ))}
        </AvatarGroup>
        <Flex gap={2}>
          <Flex color="#A855F7" gap={1}>
            <RiAttachmentFill color="#A855F7" size={22} />
            <Heading display="flex" alignItems="center" fontSize="md">
              0
            </Heading>
          </Flex>
          <Flex color="#F59E0B" gap={1}>
            <MdMessage color="#F59E0B" size={22} />
            <Heading display="flex" alignItems="center" fontSize="md">
              0
            </Heading>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
