import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { IoMdAddCircle } from "react-icons/io";

export const ModalWindow = ({
  title,
  children,
  onAccept,
  acceptText,
  type = "home",
  modalSize,
  isLoading,
  disabled,
  text = 'Client Approve'
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {type === "home" ? (
        <Flex
          cursor="pointer"
          onClick={onOpen}
          justifyContent="center"
          border="1px solid"
          borderColor="gray.200"
          rounded="md"
          w="100%"
          p={1}
          bg="white"
        >
          <IoMdAddCircle color="#C7CED9" size={50} />
        </Flex>
      ) : (
        <Button isDisabled={disabled}  onClick={onOpen} colorScheme="orange" bg="#FF6A47" mr={4} h={8}>
        {text}
        </Button>
      )}

      <Modal size={modalSize || "xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW={!modalSize ? ["200px", "1000px"] : "auto"}>
          <ModalHeader color="#FF6A47">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          {!isLoading && (
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                bg="#FF6A47"
                colorScheme="orange"
                color="white"
                onClick={async () => {
                  await onAccept();
                  onClose();
                }}
              >
                {acceptText}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
