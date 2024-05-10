import { useContext, useEffect, useRef, useState } from "react";
import { UserSeetingsContext } from "../../Provider/UserSeetingsProvider";
import { Payment } from "../../hooks/usePayments";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Stack,
  Text
} from "@chakra-ui/react";
import SendMailDialogBody from "./SendMailDialogBody";

type Props = {
  payments: Payment[],
  sumAmmount: number,
  resetPayments: () => void,
}

const SendMailButton: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userSettings } = useContext(UserSeetingsContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(
    userSettings.destMailAddr === ""
    || (userSettings.everyMonthPayment === null && props.payments.length === 0)
  );
  const [billAmmount, setBillAmmount] = useState<number>(
    props.sumAmmount + (userSettings.everyMonthPayment?.ammount ?? 0)
  );

  const [message, setMessage] = useState<string>(
    (() => {
      let message = "";
      if (userSettings.destMailAddr === "") {
        message = "メールアドレスが設定されていません";
      } else if (billAmmount === 0) {
        message = "請求額が0円です";
      }
      return message;
    })()
  );
  const cancelRef = useRef(null);

  // メールアドレスや支払い履歴が更新されたら、メール送信可否を再チェックし、メッセージを更新
  useEffect(() => {
    const newBillAmmount = props.sumAmmount + (userSettings.everyMonthPayment?.ammount ?? 0);

    let newMessage = "";
    if (userSettings.destMailAddr === "") {
      newMessage = "メールアドレスが設定されていません";
    } else if (billAmmount === 0) {
      newMessage = "請求額が0円です";
    }
    setMessage(newMessage);
    setIsDisabled(
      userSettings.destMailAddr === "" || newBillAmmount === 0
    );
    setBillAmmount(newBillAmmount)
  }, [userSettings, props.payments, props.sumAmmount]);

  const mailBody = (payments: Payment[]): string => {
    const header = "立替分は以下の通りです。";

    let body = "";
    // 手動で追加した支払い分
    payments.forEach((payment) => {
      body += `${payment.date.getMonth() + 1}月${payment.date.getDate()}日 : ${payment.title} ${payment.ammount}円%0d%0a`;
    });
    // 登録した固定費
    if (userSettings.everyMonthPayment) {
      body += `%0d%0a${userSettings.everyMonthPayment.title} ${userSettings.everyMonthPayment.ammount}円%0d%0a`;
    }
    body += `%0d%0a合計 ${billAmmount}円`;

    const footer = "よろしくお願いいたします。";

    return (
      `${header}%0d%0a%0d%0a${body}%0d%0a%0d%0a${footer}`
    );
  }

  const handleSendClick = () => {
    if (userSettings.resetOnSend) {
      props.resetPayments();
    }
    window.location.href = `mailto:${userSettings.destMailAddr}?subject=立替分の振込のお願い&body=${mailBody(props.payments)}`;
    onClose();
  }

  return (
    <>
      <Stack align={'end'}>
        <Button colorScheme="blue" isDisabled={isDisabled} w={'130px'} onClick={onOpen}>
          メールを送信
        </Button>
        <Text fontSize={'small'} color={'red'}>
          {message}
        </Text>
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader >
              <Text fontSize='lg' fontWeight='bold'>
                以下の内容でメールを送信しますか？
              </Text>
              {userSettings.resetOnSend &&
                <Text fontSize='lg' fontWeight='bold'>
                  ※送信と同時に履歴がリセットされます
                </Text>
              }
            </AlertDialogHeader>

            <SendMailDialogBody
              payments={props.payments}
              billAmmount={billAmmount}
            />

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme='blue' onClick={handleSendClick} ml={3}>
                送信
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default SendMailButton;