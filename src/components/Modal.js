import {
  Center,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Button,
  ButtonText,
  ModalBody,
  Text,
  ModalFooter,
} from '@gluestack-ui/themed';
import React, {useEffect, useState} from 'react';
const ModalLogout = props => {
  const [showModal, setShowModal] = useState(props.isShow);
  useEffect(() => {
    setShowModal(props.isShow);
  }, [props.isShow]);
  const handleShowModal = () => {
    props.setIsShowModal(false);
  };
  const handleLogout = () => {
    props.callbackLogout();
  };
  const ref = React.useRef(null);
  return (
    <Center h={300}>
      <Modal
        isOpen={showModal}
        onClose={() => {
          handleShowModal();
        }}
        finalFocusRef={ref}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">
              Do you confirm that you want to log out?
            </Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          {/* <ModalBody>
            <Text>
              Elevate user interactions with our versatile modals. Seamlessly
              integrate notifications, forms, and media displays. Make an impact
              effortlessly.
            </Text>
          </ModalBody> */}
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                handleShowModal();
              }}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                handleLogout();
              }}>
              <ButtonText>Agree</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};
export default ModalLogout;
