import {Alert, AlertIcon, AlertText, Box, InfoIcon} from '@gluestack-ui/themed';
import React from 'react';
const Feedback = (message, action) => {
  return (
    <Alert marginTop={'2%'} mx="30%" variant={'accent'} action={action}>
      <AlertIcon as={InfoIcon} mr="$3" />
      <AlertText>{message}</AlertText>
    </Alert>
  );
};

export default Feedback;
