import { HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Payment } from "../../hooks/usePayments";
import EditDrawer from "./EditDrawer";
import DeleteDialog from "./DeleteDialog";

type Props = {
  payments: Payment[],
  handleEdit: (id: number, title: string, ammount: number, date: Date) => void,
  handleDelete: (id: number) => void,
};

const PaymentList: React.FC<Props> = (props) => {
  // TODO : titleが長いとどんどん横に伸びてるから、改行するか、...にするか。
  // TODO : 日付順に並び変え
  return (
    <TableContainer>
      <Table size={"sm"}>
        <Thead>
          <Tr>
            <Th maxW={0.3} px={2}>日付</Th>
            <Th>用途</Th>
            <Th maxW={0.4}>金額</Th>
            <Th maxW={'30px'} p={1}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.payments.map((payment) => (
            <Tr key={payment.id}>
              <Td maxW={0.3} px={2}>{(payment.date.getMonth() + 1) + '/' + payment.date.getDate()}</Td>
              <Td>{payment.title}</Td>
              <Td maxW={0.4}>{payment.ammount}</Td>
              <Td maxW={'30px'} p={1}>
                <HStack spacing={4} justifyContent={"end"}>
                  <EditDrawer payment={payment} onSaveClick={props.handleEdit} />
                  <DeleteDialog
                    payment={payment}
                    onDeleteClick={() => props.handleDelete(payment.id)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default PaymentList;