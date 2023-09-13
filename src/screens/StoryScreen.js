import React, {useState} from 'react';
import {
  Box,
  Center,
  Divider,
  Heading,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import {FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import UseDataFetching from '../hooks/UseFetch';
import {uri} from '../utils/Host';
import {useNavigation} from '@react-navigation/native';
import HomeMenu from '../components/HomeMenu';
import {useDispatch, useSelector} from 'react-redux';
import ModalLogout from '../components/Modal';
const responsePayload = [
  {
    id: null,
    illustrator_id: null,
    author_id: null,
    title: '',
    language: '',
    type: '',
    thumbnail: '',
  },
];
const StoryScreen = () => {
  const dispatch = useDispatch();
  const jwt = useSelector(state => state.jwt);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isShowModalLogout, setIsShowModalLogout] = useState(false);
  const [state, refreshState] = UseDataFetching(
    `${uri}/api/stories`,
    responsePayload,
  );
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshState();
    setRefreshing(false);
  };
  const navigateToDetail = item => {
    navigation.navigate('StoryDetail', item);
  };
  const handleCallback = async prop => {
    if (prop === 'logout') {
      setIsShowModalLogout(!isShowModalLogout);
    }
  };
  const handleRequestLogout = async () => {
    const logoutState = await sendLogoutRequest();
    if (logoutState.httpStatus === 200) {
      dispatch({type: 'LOGOUT'});
    } else if (logoutState.httpStatus === 401) {
      dispatch({type: 'LOGOUT'});
    }
  };
  const sendLogoutRequest = async () => {
    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt,
      },
    };
    const request = await fetch(uri + '/api/logout', option);
    return {httpStatus: request.status};
  };
  const renderItem = (
    {item: {id, title, thumbnail, language, type}},
    callback,
  ) => {
    return (
      <TouchableOpacity
        style={{margin: 7}}
        onPress={() => callback({id, title, thumbnail, language, type})}>
        <VStack space="2xl">
          <Center>
            <Image
              size="xl"
              borderRadius="$md"
              source={{
                uri: thumbnail,
              }}
            />
            <Heading size="sm" color="$black" width={100} isTruncated={true}>
              {title}
            </Heading>
            <Text size="sm">
              {language} - {type}
            </Text>
          </Center>
        </VStack>
        <Divider my="$0.5" />
      </TouchableOpacity>
    );
  };
  if (state.isLoading) {
    return (
      <Box bg="$white" p="$5">
        <Center>
          <Text color="$black">Loading...</Text>
        </Center>
      </Box>
    );
  }
  return (
    <Box bg="$white" p="$5">
      <HomeMenu callback={handleCallback} />
      <FlatList
        data={state.data}
        renderItem={({item}) => renderItem({item}, navigateToDetail)}
        keyExtractor={item => item.id}
        numColumns={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <ModalLogout
        isShow={isShowModalLogout}
        setIsShowModal={boolean => setIsShowModalLogout(boolean)}
        callbackLogout={handleRequestLogout}
      />
    </Box>
  );
};
export default StoryScreen;
