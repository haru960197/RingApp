import { ReactNode, createContext, useState } from "react";

type Props = {
  children: ReactNode,
};

export type EveryMonthPayment = {
  title: string,
  ammount: number,
};

export type UserSettings = {
  destMailAddr: string,
  everyMonthPayments: EveryMonthPayment[],
  resetOnSend: boolean,
  purposeSuggestions: string[],
};

export const UserSeetingsContext = createContext(
  {} as {
    userSettings: UserSettings,
    setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>,
  }
);

export const DEFAULT_SUGGESTIONS = ["食費", "日用品", "交通費", "交際費", "その他"];

export const UserSeetingsProvider: React.FC<Props> = (props) => {
  const { children } = props;

  const [userSettings, setUserSettings] = useState<UserSettings>(
    ((): UserSettings => {
      const userSettingsStr = localStorage.getItem("userSettings");
      if (userSettingsStr) {
        const parsed = JSON.parse(userSettingsStr);
        let everyMonthPayments: EveryMonthPayment[] = [];
        if (Array.isArray(parsed.everyMonthPayments)) {
          everyMonthPayments = parsed.everyMonthPayments;
        } else if (parsed.everyMonthPayment && typeof parsed.everyMonthPayment === "object" && parsed.everyMonthPayment.title) {
          everyMonthPayments = [parsed.everyMonthPayment];
        }
        return {
          destMailAddr: parsed.destMailAddr ?? "",
          everyMonthPayments,
          resetOnSend: parsed.resetOnSend ?? false,
          purposeSuggestions: parsed.purposeSuggestions ?? DEFAULT_SUGGESTIONS,
        };
      } else {
        return ({
          destMailAddr: "",
          everyMonthPayments: [],
          resetOnSend: false,
          purposeSuggestions: DEFAULT_SUGGESTIONS,
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