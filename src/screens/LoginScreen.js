import React, {useState} from 'react';
import {
  AddIcon,
  Alert,
  AlertIcon,
  AlertText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  HStack,
  InfoIcon,
  Input,
  InputInput,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import Aleart from '../components/Aleart';
import {uri} from '../utils/Host';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const loadingComponent = <Spinner size={60} />;
  const loginRequest = async () => {
    const request = await fetch(uri + '/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username: username, password: password}),
    });
    const response = await request.json();
    return {httpStatus: request.status, response: response};
  };
  const handleSubmit = async () => {
    setIsUsernameInvalid(false);
    setIsPasswordInvalid(false);
    if (username.length < 6 || password.length < 6) {
      showDialog(
        {
          message: 'username and password must be greater than 6 characters',
          action: 'warning',
        },
        presentFormLogin,
      );
      return;
    }
    setFeedback(loadingComponent);
    const loginState = await loginRequest();
    if (loginState.httpStatus === 200) {
      showDialog({
        message: 'login successful, waiting 5 seconds',
        action: 'success',
      });
    } else if (loginState.httpStatus === 401) {
      showDialog({message: 'username or password is wrong', action: 'error'});
    }
  };
  const showDialog = (
    {message = 'unknown diaglog', action = 'info'},
    callback,
  ) => {
    if (typeof callback === 'function') {
      callback();
    }
    setFeedback(Aleart(message, action));
  };

  const presentFormLogin = () => {
    setIsUsernameInvalid(username.length < 6);
    setIsPasswordInvalid(password.length < 6);
  };
  return (
    <Box h="$80" paddingTop={'5%'} alignItems="center">
      <VStack space="md" reversed={false} w="$80">
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={isUsernameInvalid}
          isReadOnly={false}>
          <InputInput
            placeholder="username"
            onChangeText={text => {
              setUsername(text);
              setIsUsernameInvalid(false);
            }}
          />
        </Input>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={isPasswordInvalid}
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
      {feedback}
    </Box>
  );
};
export default LoginScreen;
