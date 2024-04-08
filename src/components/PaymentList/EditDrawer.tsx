import { EditIcon } from "@chakra-ui/icons"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormControl, FormLabel, Input, NumberInput, NumberInputField, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react";
import { Payment } from "../../hooks/usePayments";

type Props = {
  payment: Payment,
  onSaveClick: (id: number, title: string, ammount: number, date: Date) => void,
}

const EditDrawer: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState<string>(props.payment.title);
  const [ammount, setAmmount] = useState<number>(props.payment.ammount);
  const [date, setDate] = useState<Date>(props.payment.date);

  const firstInputRef = useRef(null);

  const handleSaveClick = (): void => {
    props.onSaveClick(props.payment.id, title, ammount, date);
    onClose();
  }

  const handleCanselClick = (): void => {
    setTitle(props.payment.title);
    setAmmount(props.payment.ammount);
    setDate(props.payment.date);

    onClose();
  }

  return (
    <>
      <EditIcon onClick={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        initialFocusRef={firstInputRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>編集</DrawerHeader>

          <DrawerBody>
            <FormControl>
              <FormLabel>用途</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} ref={firstInputRef}/>
            </FormControl>

            <FormControl>
              <FormLabel>金額</FormLabel>
              <NumberInput
                value={ammount}
                onChange={(valueStr) => setAmmount(Number(valueStr))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>日付</FormLabel>
              <Input
                type={"date"}
                value={date.toLocaleDateString('sv-SE')}
                onChange={(e) => setDate(new Date(Date.parse(e.target.value)))}
              />
            </FormControl>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={handleCanselClick}>
              キャンセル
            </Button>
            <Button colorScheme='blue' isDisabled={title === "" || ammount === 0} onClick={handleSaveClick}>
              保存
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditDrawer;