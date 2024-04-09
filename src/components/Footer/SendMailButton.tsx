import { useContext, useEffect, useState } from "react";
import { UserSeetingsContext } from "../../Provider/UserSeetingsProvider";
import { Payment } from "../../hooks/usePayments";
import { Button, Link, Stack, Text } from "@chakra-ui/react";

type Props = {
  payments: Payment[],
}

const SendMailButton: React.FC<Props> = (props) => {
  const { userSettings } = useContext(UserSeetingsContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(
    userSettings.destMailAddr === ""
    || (userSettings.everyMonthPayment === null && props.payments.length === 0)
  );
  const [message, setMessage] = useState<string>(
    (() => {
      let message = "";
      if (userSettings.destMailAddr === "") {
        message = "メールアドレスが設定されていません";
      } else if (userSettings.everyMonthPayment === null && props.payments.length === 0) {
        message = "請求額が0円です";
      }
      return message;
    })()
  );

  // メールアドレスや支払い履歴が更新されたら、メール送信可否を再チェックし、メッセージを更新
  useEffect(() => {
    setIsDisabled(
      userSettings.destMailAddr === ""
      || (userSettings.everyMonthPayment === null && props.payments.length === 0)
    );

    let newMessage = "";
    if (userSettings.destMailAddr === "") {
      newMessage = "メールアドレスが設定されていません";
    } else if (userSettings.everyMonthPayment === null && props.payments.length === 0) {
      newMessage = "請求額が0円です";
    }
    setMessage(newMessage);
  }, [userSettings, props.payments]);

  const mailBody = (payments: Payment[]): string => {
    const header = "立替分は以下の通りです。";

    let body = "";
    let sumAmmount = 0;
    // 手動で追加した支払い分
    payments.forEach((payment) => {
      body += `${payment.date.getMonth() + 1}月${payment.date.getDate()}日 : ${payment.title} ${payment.ammount}円%0d%0a`;
      sumAmmount += payment.ammount;
    });
    // 登録した固定費
    if (userSettings.everyMonthPayment) {
      body += `%0d%0a${userSettings.everyMonthPayment.title} ${userSettings.everyMonthPayment.ammount}円%0d%0a`;
      sumAmmount += userSettings.everyMonthPayment.ammount;
    }
    body += `%0d%0a合計 ${sumAmmount}円`

    const footer = "よろしくお願いいたします。";

    return (
      `${header}%0d%0a%0d%0a${body}%0d%0a%0d%0a${footer}`
    );
  }

  return (
    <Stack align={'end'}>
      <Button colorScheme="blue" isDisabled={isDisabled} w={'130px'}>
        <Link
          href={isDisabled ? "" : `mailto:${userSettings.destMailAddr}?subject=立替分の振込のお願い&body=${mailBody(props.payments)}`}
        >
          メールを送信
        </Link>
      </Button>
      <Text fontSize={'small'} color={'red'}>
        {message}
      </Text>
    </Stack>
  );
};

export default SendMailButton;