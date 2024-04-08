import { useEffect, useState } from "react";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

interface IGmailApi {
  isGapiInited: boolean,
  isSignedIn: boolean;
  handleSignInAndSendGmail: (mailInfo: MailInfo) => Promise<void>;
  handleSignOut: () => Promise<void>;
  sendEmail: (mailInfo: MailInfo) => Promise<void>;
}

export type MailInfo = {
  to: string,
  subject: string,
  body: string,
}

const useGmailApi = (): IGmailApi => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isGapiInited, setIsGapiInited] = useState<boolean>(false);

  useEffect(() => {
    const initGapi = async () => {
      const gapi = window.gapi;

      await gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });

        setIsGapiInited(true);
      });
    }

    initGapi();
  }, []);

  const handleSignInAndSendGmail = async (mailInfo: MailInfo) => {
    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID ?? "",
      scope: SCOPES,
      callback: () => {
        sendEmail(mailInfo);
        setIsSignedIn(true);
      },
    });

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  const handleSignOut = async () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {});
      gapi.client.setToken(null);
    }
  }

  const sendEmail = async (mailInfo: MailInfo) => {
    try {
      if (!isGapiInited) {
        console.error('gapi is not inited.');
        return;
      }

      // メールデータの作成。
      const mimeData = [
        `To: ${mailInfo.to}`,
        'Subject: =?utf-8?B?' + btoa(unescape(encodeURIComponent(mailInfo.subject))) + '?=',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        mailInfo.body,
      ].join('\n').trim();
      const raw = btoa(unescape(encodeURIComponent(mimeData))).replace(/\+/g, '-').replace(/\//g, '_');

      // メールの送信。
      await gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': { raw: raw },
      });
      console.log('Sent email');

    } catch (e) {
      console.error(e);
    }
  }

  return {
    isGapiInited,
    isSignedIn,
    handleSignInAndSendGmail,
    handleSignOut,
    sendEmail,
  };
};

export default useGmailApi;