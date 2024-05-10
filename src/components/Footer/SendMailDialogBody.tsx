import { useContext } from "react";
import { Payment } from "../../hooks/usePayments"
import {
  AlertDialogBody,
  Box,
  Text
} from "@chakra-ui/react";
import { UserSeetingsContext } from "../../Provider/UserSeetingsProvider";


type Props = {
  payments: Payment[];
  billAmmount: number;
};

const SendMailDialogBody: React.FC<Props> = (props) => {
  const { userSettings } = useContext(UserSeetingsContext);
  const header = "立替分は以下の通りです。";
  const footer = "よろしくお願いいたします。";
  return (
    <AlertDialogBody py={1} px={2}>
      <Box borderWidth={2} px={4} py={2}>
        <Text>{header}</Text>

        <br />

        {props.payments.map((payment) => (
          <Text>
            {`${payment.date.getMonth() + 1}月${payment.date.getDate()}日 : ${payment.title} ${payment.ammount}円`}
          </Text>
        ))}
        <br />
        {userSettings.everyMonthPayment &&
          <Text>
            {`${userSettings.everyMonthPayment.title} ${userSettings.everyMonthPayment.ammount}円`}
          </Text>}
        <br />
        <Text>{`合計 ${props.billAmmount}円`}</Text>

        <br />

        <Text>{footer}</Text>
      </Box>
    </AlertDialogBody>
  );
};

export default SendMailDialogBody;