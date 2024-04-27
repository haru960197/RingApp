import { SettingsIcon } from "@chakra-ui/icons"
import { Button, Checkbox, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Input, NumberInput, NumberInputField, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react";
import { UserSeetingsContext, UserSettings } from "../../Provider/UserSeetingsProvider";

const SettingDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userSettings, setUserSettings } = useContext(UserSeetingsContext);
  const [destMailAddrInput, setDestMailAddrInput] = useState(userSettings.destMailAddr);
  const [titleInput, setTitleInput] = useState<string>(userSettings.everyMonthPayment?.title ?? "");
  const [ammountInput, setAmmountInput] = useState<number>(userSettings.everyMonthPayment?.ammount ?? 0);
  const [resetOnSendInput, setResetOnSendinput] = useState<boolean>(userSettings.resetOnSend);
  const firstInputRef = useRef(null);

  const handleSaveClick = (): void => {
    const newUserSettings: UserSettings = {
      destMailAddr: destMailAddrInput,
      everyMonthPayment:
        (titleInput !== "" && ammountInput !== 0)
          ? {
            title: titleInput,
            ammount: ammountInput,
          }
          : null,
      resetOnSend: resetOnSendInput,
    };
    setUserSettings(newUserSettings);
    localStorage.setItem("userSettings", JSON.stringify(newUserSettings));
    onClose();
  }

  const handleCanselClick = (): void => {
    setDestMailAddrInput(userSettings.destMailAddr);
    setTitleInput(userSettings.everyMonthPayment?.title ?? "");
    setAmmountInput(userSettings.everyMonthPayment?.ammount ?? 0);
    setResetOnSendinput(userSettings.resetOnSend);
    onClose();
  }

  return (
    <>
      <SettingsIcon onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        initialFocusRef={firstInputRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>設定</DrawerHeader>

          <DrawerBody>
            <FormControl>
              <FormLabel>請求先メールアドレス</FormLabel>
              <Input
                value={destMailAddrInput}
                onChange={(e) => setDestMailAddrInput(e.target.value)}
                ref={firstInputRef}
              />
            </FormControl>

            <Text marginTop={4}>固定の請求</Text>
            <Stack paddingLeft={2} marginTop={2}>
              <FormControl>
                <FormLabel>用途</FormLabel>
                <Input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>金額</FormLabel>
                <NumberInput
                  value={ammountInput}
                  onChange={(valueStr) => setAmmountInput(Number(valueStr))}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Stack>
            <FormControl>
              <FormLabel>メール送信時に履歴をリセット</FormLabel>
              <Checkbox
                isChecked={resetOnSendInput}
                onChange={(e) => setResetOnSendinput(e.target.checked)}
              >
                リセット
              </Checkbox>
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={handleCanselClick}>
              キャンセル
            </Button>
            <Button colorScheme='blue' onClick={handleSaveClick}>
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SettingDrawer;