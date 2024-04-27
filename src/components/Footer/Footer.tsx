import {  HStack } from "@chakra-ui/react";
import React from "react";

import { Payment } from "../../hooks/usePayments";
import SendMailButton from "./SendMailButton";

type Props = {
	payments: Payment[],
	sumAmmount: number,
}

const Footer: React.FC<Props> = (props) => {

	return (
		<HStack justify={"end"} px={2}>
			<SendMailButton payments={props.payments} sumAmmount={props.sumAmmount} />
		</HStack>
	);
}

export default Footer;