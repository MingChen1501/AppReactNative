import {
  Fab,
  FabLabel,
  CloseIcon,
  Icon,
  Menu,
  MenuItem,
  MenuItemLabel,
  SettingsIcon,
} from '@gluestack-ui/themed';
import React from 'react';
function floatingActionButton(props) {
  return (
    <Fab
      {...props}
      marginBottom={32}
      size="lg"
      placement="top right"
      isHovered={false}
      isDisabled={false}
      isPressed={false}>
      <FabLabel>Setting</FabLabel>
    </Fab>
  );
}
export default function HomeMenu({callback}) {
  const SETTING = 'settings';
  const LOGOUT = 'logout';
  const handlePress = key => {
    callback(key);
  };
  return (
    <Menu
      placement="top"
      trigger={({...triggerProps}) => floatingActionButton({...triggerProps})}>
      <MenuItem
        key="Settings"
        textValue="Settings"
        onPress={() => handlePress(SETTING)}>
        <Icon as={SettingsIcon} size="sm" mr="$2" />
        <MenuItemLabel size="sm">Settings</MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Logout"
        textValue="Logout"
        onPress={() => handlePress(LOGOUT)}>
        <Icon as={CloseIcon} size="sm" mr="$2" />
        <MenuItemLabel size="sm">Logout</MenuItemLabel>
      </MenuItem>
    </Menu>
  );
}
