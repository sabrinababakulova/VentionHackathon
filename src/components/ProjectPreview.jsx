import React from "react";
import { Flex, Heading, AvatarGroup, Avatar, Text } from "@chakra-ui/react";
import { RiAttachmentFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MdMessage } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const ProjectPreview = ({ item, projs }) => {
  const correctProject = projs.find((proj) => proj.id === item);
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Flex
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => navigate(`/projects/${correctProject?.id}`)}
      flexDirection="column"
      justifyContent="space-between"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      p={4}
      w="100%"
      h="120px"
    >
      <Heading fontSize="md">{correctProject?.name}</Heading>
    <Text>{correctProject?.monthsNeeded} months</Text>
      <Flex w="100%" justifyContent="space-between" gap={2}>
        <AvatarGroup size="xs" max={2}>
          {correctProject?.users &&
            correctProject?.users.map((user) => (
              <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
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
