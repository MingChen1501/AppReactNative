import React, {useState} from 'react';
import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  Input,
  InputInput,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    // Perform login logic using the email and password values
    // Call an authentication function or dispatch a login action
    console.log('Email:', email);
    console.log('Password:', password);
    setIsLoading(true);
  };
  return (
    <Center h="$80">
      <VStack space="md" reversed={false} w="$80">
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputInput placeholder="username" onChangeText={setEmail} />
        </Input>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputInput
            type="password"
            placeholder="password"
            onChangeText={setPassword}
          />
        </Input>
        <Button
          size="md"
          variant="solid"
          action="primary"
          isDisabled={false}
          isFocusVisible={false}
          onPress={handleSubmit}>
          <ButtonText>Login</ButtonText>
        </Button>
      </VStack>
      {isLoading ? <Spinner size={40} color="primary.500" /> : null}
    </Center>
  );
};
export default LoginScreen;
