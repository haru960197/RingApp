import { SettingsIcon, EditIcon, DeleteIcon, CheckIcon, CloseIcon, AddIcon } from "@chakra-ui/icons"
import { Button, Checkbox, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, HStack, IconButton, Input, NumberInput, NumberInputField, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react";
import { UserSeetingsContext, UserSettings, EveryMonthPayment } from "../../Provider/UserSeetingsProvider";

const SettingDrawer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userSettings, setUserSettings } = useContext(UserSeetingsContext);
  const [destMailAddrInput, setDestMailAddrInput] = useState(userSettings.destMailAddr);

  const [everyMonthPaymentsInput, setEveryMonthPaymentsInput] = useState<EveryMonthPayment[]>(
    userSettings.everyMonthPayments ?? []
  );
  const [newFixedCostTitle, setNewFixedCostTitle] = useState("");
  const [newFixedCostAmmount, setNewFixedCostAmmount] = useState<number>(0);
  const [editingFixedCostIndex, setEditingFixedCostIndex] = useState<number | null>(null);
  const [editingFixedCostTitle, setEditingFixedCostTitle] = useState("");
  const [editingFixedCostAmmount, setEditingFixedCostAmmount] = useState<number>(0);

  const [resetOnSendInput, setResetOnSendinput] = useState<boolean>(userSettings.resetOnSend);
  const [purposeSuggestionsInput, setPurposeSuggestionsInput] = useState<string[]>(
    userSettings.purposeSuggestions ?? []
  );
  const [newSuggestion, setNewSuggestion] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const firstInputRef = useRef(null);

  const handleAddFixedCost = () => {
    const trimmed = newFixedCostTitle.trim();
    if (trimmed && newFixedCostAmmount !== 0) {
      setEveryMonthPaymentsInput([
        ...everyMonthPaymentsInput,
        { title: trimmed, ammount: newFixedCostAmmount }
      ]);
      setNewFixedCostTitle("");
      setNewFixedCostAmmount(0);
    }
  };

  const handleDeleteFixedCost = (index: number) => {
    const nextList = everyMonthPaymentsInput.filter((_, i) => i !== index);
    setEveryMonthPaymentsInput(nextList);
    if (editingFixedCostIndex === index) {
      setEditingFixedCostIndex(null);
    } else if (editingFixedCostIndex !== null && editingFixedCostIndex > index) {
      setEditingFixedCostIndex(editingFixedCostIndex - 1);
    }
  };

  const handleStartEditFixedCost = (index: number) => {
    setEditingFixedCostIndex(index);
    setEditingFixedCostTitle(everyMonthPaymentsInput[index].title);
    setEditingFixedCostAmmount(everyMonthPaymentsInput[index].ammount);
  };

  const handleSaveEditFixedCost = (index: number) => {
    const trimmed = editingFixedCostTitle.trim();
    if (trimmed && editingFixedCostAmmount !== 0) {
      const nextList = [...everyMonthPaymentsInput];
      nextList[index] = { title: trimmed, ammount: editingFixedCostAmmount };
      setEveryMonthPaymentsInput(nextList);
      setEditingFixedCostIndex(null);
    }
  };

  const handleCancelEditFixedCost = () => {
    setEditingFixedCostIndex(null);
  };

  const handleAddSuggestion = () => {
    const trimmed = newSuggestion.trim();
    if (trimmed && purposeSuggestionsInput.length < 5) {
      if (!purposeSuggestionsInput.includes(trimmed)) {
        setPurposeSuggestionsInput([...purposeSuggestionsInput, trimmed]);
      }
      setNewSuggestion("");
    }
  };

  const handleDeleteSuggestion = (index: number) => {
    const nextList = purposeSuggestionsInput.filter((_, i) => i !== index);
    setPurposeSuggestionsInput(nextList);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(purposeSuggestionsInput[index]);
  };

  const handleSaveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (trimmed) {
      const nextList = [...purposeSuggestionsInput];
      nextList[index] = trimmed;
      setPurposeSuggestionsInput(nextList);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleSaveClick = (): void => {
    const newUserSettings: UserSettings = {
      destMailAddr: destMailAddrInput,
      everyMonthPayments: everyMonthPaymentsInput,
      resetOnSend: resetOnSendInput,
      purposeSuggestions: purposeSuggestionsInput,
    };
    setUserSettings(newUserSettings);
    localStorage.setItem("userSettings", JSON.stringify(newUserSettings));
    onClose();
  }

  const handleCanselClick = (): void => {
    setDestMailAddrInput(userSettings.destMailAddr);
    setEveryMonthPaymentsInput(userSettings.everyMonthPayments ?? []);
    setEditingFixedCostIndex(null);
    setNewFixedCostTitle("");
    setNewFixedCostAmmount(0);
    setResetOnSendinput(userSettings.resetOnSend);
    setPurposeSuggestionsInput(userSettings.purposeSuggestions ?? []);
    setEditingIndex(null);
    setNewSuggestion("");
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
                ref={destMailAddrInput === "" ? firstInputRef : null}
              />
            </FormControl>

            <Text marginTop={4} fontWeight="bold" fontSize="md">固定の請求</Text>
            <Stack spacing={2} marginTop={2} paddingLeft={1}>
              {everyMonthPaymentsInput.map((payment, index) => (
                <HStack key={index} justify="space-between" align="center" minH="40px" borderWidth="1px" borderRadius="md" p={2} borderColor="gray.200" bg="gray.50">
                  {editingFixedCostIndex === index ? (
                    <HStack w="100%" spacing={1}>
                      <Input
                        size="sm"
                        placeholder="用途"
                        value={editingFixedCostTitle}
                        onChange={(e) => setEditingFixedCostTitle(e.target.value)}
                        bg="white"
                        autoFocus
                      />
                      <NumberInput
                        size="sm"
                        w="90px"
                        value={editingFixedCostAmmount}
                        onChange={(valStr) => setEditingFixedCostAmmount(Number(valStr))}
                        bg="white"
                      >
                        <NumberInputField px={2} />
                      </NumberInput>
                      <IconButton
                        aria-label="Save edit"
                        icon={<CheckIcon />}
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleSaveEditFixedCost(index)}
                        isDisabled={!editingFixedCostTitle.trim() || editingFixedCostAmmount === 0}
                      />
                      <IconButton
                        aria-label="Cancel edit"
                        icon={<CloseIcon />}
                        size="xs"
                        colorScheme="gray"
                        onClick={handleCancelEditFixedCost}
                      />
                    </HStack>
                  ) : (
                    <>
                      <HStack spacing={2} isTruncated>
                        <Text fontSize="sm" fontWeight="medium" isTruncated>{payment.title}</Text>
                        <Text fontSize="sm" color="gray.600">{payment.ammount.toLocaleString()}円</Text>
                      </HStack>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit fixed cost"
                          icon={<EditIcon />}
                          size="xs"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleStartEditFixedCost(index)}
                        />
                        <IconButton
                          aria-label="Delete fixed cost"
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteFixedCost(index)}
                        />
                      </HStack>
                    </>
                  )}
                </HStack>
              ))}

              <HStack marginTop={2} spacing={1}>
                <Input
                  size="sm"
                  placeholder="用途"
                  value={newFixedCostTitle}
                  onChange={(e) => setNewFixedCostTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFixedCost();
                    }
                  }}
                />
                <NumberInput
                  size="sm"
                  w="90px"
                  value={newFixedCostAmmount === 0 ? "" : newFixedCostAmmount}
                  onChange={(valStr) => setNewFixedCostAmmount(Number(valStr))}
                >
                  <NumberInputField placeholder="金額" px={2} />
                </NumberInput>
                <IconButton
                  aria-label="Add fixed cost"
                  icon={<AddIcon />}
                  size="sm"
                  colorScheme="blue"
                  onClick={handleAddFixedCost}
                  isDisabled={!newFixedCostTitle.trim() || newFixedCostAmmount === 0}
                />
              </HStack>
            </Stack>
            <FormControl marginTop={4}>
              <FormLabel>メール送信時に履歴をリセット</FormLabel>
              <Checkbox
                isChecked={resetOnSendInput}
                onChange={(e) => setResetOnSendinput(e.target.checked)}
              >
                リセット
              </Checkbox>
            </FormControl>

            <Text marginTop={6} fontWeight="bold" fontSize="md">用途の候補 (最大5件)</Text>
            <Stack spacing={2} marginTop={2} paddingLeft={1}>
              {purposeSuggestionsInput.map((suggestion, index) => (
                <HStack key={index} justify="space-between" align="center" h="40px" borderWidth="1px" borderRadius="md" p={2} borderColor="gray.200" bg="gray.50">
                  {editingIndex === index ? (
                    <HStack w="100%" spacing={1}>
                      <Input
                        size="sm"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        bg="white"
                        autoFocus
                      />
                      <IconButton
                        aria-label="Save edit"
                        icon={<CheckIcon />}
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleSaveEdit(index)}
                      />
                      <IconButton
                        aria-label="Cancel edit"
                        icon={<CloseIcon />}
                        size="xs"
                        colorScheme="gray"
                        onClick={handleCancelEdit}
                      />
                    </HStack>
                  ) : (
                    <>
                      <Text fontSize="sm" isTruncated>{suggestion}</Text>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit suggestion"
                          icon={<EditIcon />}
                          size="xs"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleStartEdit(index)}
                        />
                        <IconButton
                          aria-label="Delete suggestion"
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteSuggestion(index)}
                        />
                      </HStack>
                    </>
                  )}
                </HStack>
              ))}

              {purposeSuggestionsInput.length < 5 && (
                <HStack marginTop={2} spacing={1}>
                  <Input
                    size="sm"
                    placeholder="新しい候補を追加"
                    value={newSuggestion}
                    onChange={(e) => setNewSuggestion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSuggestion();
                      }
                    }}
                  />
                  <IconButton
                    aria-label="Add suggestion"
                    icon={<AddIcon />}
                    size="sm"
                    colorScheme="blue"
                    onClick={handleAddSuggestion}
                    isDisabled={!newSuggestion.trim()}
                  />
                </HStack>
              )}
            </Stack>
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