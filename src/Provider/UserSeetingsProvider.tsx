import { ReactNode, createContext, useState } from "react";

type Props = {
  children: ReactNode,
};

export type UserSettings = {
  destMailAddr: string,
  everyMonthPayment: { title: string, ammount: number } | null,
  resetOnSend: boolean,
};

export const UserSeetingsContext = createContext(
  {} as {
    userSettings: UserSettings,
    setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>,
  }
);

export const UserSeetingsProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [userSettings, setUserSettings] = useState<UserSettings>(
    ((): UserSettings => {
      const userSettingsStr = localStorage.getItem("userSettings");
      if (userSettingsStr) {
        return JSON.parse(userSettingsStr) as UserSettings;
      } else {
        return ({
          destMailAddr: "",
          everyMonthPayment: null,
          resetOnSend: false,
        } satisfies UserSettings);
      }
    })()
  );

  return (
    <UserSeetingsContext.Provider value={{ userSettings, setUserSettings }} >
      { children }
    </UserSeetingsContext.Provider>
  );
};