import { HStack, Text } from "@chakra-ui/react";
import React from "react";
import SettingDrawer from "./SettingDrawer";

type Props = {
	fontSize: string,
	iconSize: string,
	bg: string,
};

const Header: React.FC<Props> = (props) => {
	return (
		<HStack justify={"space-between"} bg={props.bg} px={2} paddingBottom={1} boxShadow={"md"}>
			<Text fontSize={props.fontSize}>Ring-App</Text>
			<SettingDrawer />
		</HStack>
	)
}

export default Header;