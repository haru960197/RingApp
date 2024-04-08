import { useContext } from "react";
import useGmailApi, { MailInfo } from "../../hooks/useGmailApi"
import { UserSeetingsContext } from "../../Provider/UserSeetingsProvider";
import { Payment } from "../../hooks/usePayments";
import { Button } from "@chakra-ui/react";

type Props = {
  payments: Payment[],
}

const SendMailButton: React.FC<Props> = (props) => {
  const {
    isGapiInited,
    isSignedIn,
    handleSignInAndSendGmail,
    sendEmail,
  } = useGmailApi();
  const { userSettings } = useContext(UserSeetingsContext);

  const mailBody = (payments: Payment[]): string => {
    const header = "立替分は以下の通りです。";

    let body = "";
    let sumAmmount = 0;
    // 手動で追加した支払い分
    payments.forEach((payment) => {
      body += `${payment.date.getMonth() + 1}月${payment.date.getDate()}日 : ${payment.title} ${payment.ammount}円\n`;
      sumAmmount += payment.ammount;
    });
    // 登録した固定費
    if (userSettings.everyMonthPayment) {
      body += `\n${userSettings.everyMonthPayment.title} ${userSettings.everyMonthPayment.ammount}円\n`;
      sumAmmount += userSettings.everyMonthPayment.ammount;
    }
    body += `\n合計 ${sumAmmount}円`

    const footer = "よろしくお願いいたします。";

    return (
      `${header}\n\n${body}\n\n${footer}`
    );
  }

  const mailInfo: MailInfo = {
    to: userSettings.destMailAddr,
    subject: "立替分の振込のお願い",
    body: mailBody(props.payments),
  };

  const handleClick = (): void => {
    console.log(mailInfo);
    if (isSignedIn) {
      sendEmail(mailInfo);
    } else {
      handleSignInAndSendGmail(mailInfo);
    }
  };

  return (
    <Button
      colorScheme="blue"
      onClick={handleClick}
      isDisabled={!isGapiInited || userSettings.destMailAddr === "" || props.payments.length === 0}
    >
      メールを送信
    </Button>
  );
};

export default SendMailButton;