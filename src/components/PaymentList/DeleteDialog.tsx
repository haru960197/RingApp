import { DeleteIcon } from '@chakra-ui/icons';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Payment } from '../../hooks/usePayments';

type Props = {
  payment: Payment;
  onDeleteClick: () => void;
};

const DeleteDialog: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleDeleteClick = (): void => {
    props.onDeleteClick();
    onClose();
  }

  return (
    <>
      <DeleteIcon color={'red'} onClick={onOpen} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              支払い履歴を削除
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text fontSize={'lg'}>用途：{props.payment.title}</Text>
              <Text fontSize={'lg'}>金額：{props.payment.ammount}</Text>
              <Text fontSize={'lg'}>日付：{`${props.payment.date.getMonth()+1}/${props.payment.date.getDate()}`}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                キャンセル
              </Button>
              <Button colorScheme='red' onClick={handleDeleteClick} ml={3}>
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteDialog;