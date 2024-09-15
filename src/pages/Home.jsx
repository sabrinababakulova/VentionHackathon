import React, { useState } from "react";
import { Center, Spinner, Text, Box, Flex, Heading } from "@chakra-ui/react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ProjectPreview } from "../components/ProjectPreview";
import { TableRow } from "../components/TableRow";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../apiClient";
import { useEffect } from "react";

const Home = () => {
  const getProjects = async () => {
    try {
      const { data } = await apiClient.get("/api/project/user-projects");
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: Infinity,
  });

  const [items, setItems] = useState({
    "Negotiation Phase": ["1", "2", "3"],
    "Ideas Generation": ["4", "5", "6"],
    "PDW Phase": ["7", "8", "9"],
    "In Development": [],
  });
  const [activeId, setActiveId] = useState();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const TABLE_ITEMS = [
    "Negotiation Phase",
    "Ideas Generation",
    "PDW Phase",
    "In Development",
  ];

  const getState = (state) => {
    switch (state) {
      case "Negotiation Phase":
        return 1;
      case "Ideas Generation":
        return 2;
      case "PDW Phase":
        return 3;
      case "In Development":
        return 4;
      default:
        return 1;
    }
  };

  useEffect(() => {
    if (data && !isLoading) {
      const negotiationPhase = data?.$values?.filter(
        (item) => item.state === 1,
      );
      const ideasGeneration = data?.$values?.filter((item) => item.state === 2);
      const pdwPhase = data?.$values?.filter((item) => item.state === 3);
      const inDevelopment = data?.$values?.filter((item) => item.state === 4);
      setItems({
        "Negotiation Phase": negotiationPhase.map((item) => item.id),
        "Ideas Generation": ideasGeneration.map((item) => item.id),
        "PDW Phase": pdwPhase.map((item) => item.id),
        "In Development": inDevelopment.map((item) => item.id),
      });
    }
  }, [data, isLoading]);

  function findContainer(id) {
    if (id in items) {
      return id;
    }

    return Object.keys(items).find((key) => items[key].includes(id));
  }

  function handleDragStart(event) {
    const { active } = event;
    const { id } = active;

    setActiveId(id);
  }

  function handleDragOver(event) {
    const { active, over, draggingRect } = event;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.indexOf(id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem =
          over &&
          overIndex === overItems.length - 1 &&
          draggingRect?.offsetTop > over?.rect?.offsetTop + over?.rect?.height;

        const modifier = isBelowLastItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          items[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    const { id } = active;
    const { id: overId } = over;

    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = items[activeContainer].indexOf(active.id);
    const overIndex = items[overContainer].indexOf(overId);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex,
        ),
      }));
    }

    await apiClient.put(
      `/api/project/change-state?projectId=${id}&state=${getState(overContainer)}`,
    );
    setActiveId(null);
  }
  const getNumberScheme = (index) => {
    switch (index) {
      case 0:
        return "rgba(234, 179, 8, 0.1)";
      case 1:
        return "rgba(236, 72, 153, 0.1)";
      case 2:
        return "rgba(168, 85, 247, 0.1)";
      case 3:
        return "rgba(34, 197, 94, 0.1)";
      default:
        return "rgba(34, 197, 94, 0.1)";
    }
  };
  const getNumberColorScheme = (index) => {
    switch (index) {
      case 0:
        return "rgba(202, 138, 4, 1)";
      case 1:
        return "#DB2777";
      case 2:
        return "#9333EA";
      case 3:
        return "#16A34A";
      default:
        return "#DB2777";
    }
  };

  if (isLoading || !data) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  return (
    <Box p={12} px={[4, 16]} w="100%">
      <Heading color="#FF6A47" mb={10}>
        Projects Board
      </Heading>
      <Flex h="100vh" gap={4} w="100%" flexWrap={["wrap", "nowrap"]}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {TABLE_ITEMS?.map((item, index) => (
            <Box
              key={item}
              bg="white"
              w="100%"
              pr={3}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              <Flex gap="4">
                <Heading mb={4} fontSize="xl">
                  {item}
                </Heading>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  h="7"
                  w="7"
                  rounded="2xl"
                  bg={getNumberScheme(index)}
                >
                  <Text
                    color={getNumberColorScheme(index)}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {items?.[item]?.length}
                  </Text>
                </Flex>
              </Flex>
              <TableRow id={item} items={items?.[item]} projs={data?.$values} />
            </Box>
          ))}
          <DragOverlay>
            {activeId ? <ProjectPreview projs={data?.$values} item={activeId} /> : null}
          </DragOverlay>
        </DndContext>
      </Flex>
    </Box>
  );
};

export default Home;
