import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  VStack,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { MdDriveFolderUpload } from "react-icons/md";

export const FileInput = ({ explanation, setUploadedFile, restrictions }) => {
  const [error, setError] = useState(false);
  const handleFileUpload = (e) => {
    const summary = e.target.files?.[0];
    if (!summary) {
      setError(true);
    } else {
      setError(false);
      setUploadedFile(summary);
    }
  };

  return (
    <>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>
            Expected to get two files, got one
          </AlertDescription>
        </Alert>
      )}
      <Flex
        mt={2}
        position="relative"
        border="2px dashed gray"
        borderRadius="12px"
        h="100%"
        w="100%"
        alignItems="center"
        justifyContent="center"
        px={25}
        py={3}
        gap={10}
      >
        <MdDriveFolderUpload size={30} />
        <VStack alignItems="start">
          <Heading fontWeight="500" size="sm">
            {explanation}
          </Heading>
          <Text fontSize="xs">
            Click to upload or drag and drop {restrictions}
          </Text>
          <Text fontSize="xs"></Text>
          <Input
            accept={restrictions.join(",")}
            type="file"
            multiple
            onChange={handleFileUpload}
            opacity="0"
            w="100%"
            h="100%"
            position="absolute"
            top={0}
            right={0}
          />
        </VStack>
      </Flex>
    </>
  );
};
