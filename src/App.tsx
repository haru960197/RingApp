import { ChakraProvider, Stack } from '@chakra-ui/react'
import Header from './components/Header/Header';
import RegisterForm from './components/RegisterForm/RegisterForm';
import PaymentList from './components/PaymentList/PaymentList';
import Footer from './components/Footer/Footer';
import { usePayments } from './hooks/usePayments';
import { UserSeetingsProvider } from './Provider/UserSeetingsProvider';

const App: React.FC = () => {
  const { payments, sumAmmount, addPayment, editPayment, deletePayment } = usePayments();

  return (
    <ChakraProvider>
      <UserSeetingsProvider>
        <Header fontSize={"3xl"} iconSize={"6"} bg='blue.100' />
        <Stack p="2">
          <RegisterForm onSubmit={addPayment} />
          <PaymentList payments={payments} handleEdit={editPayment} handleDelete={deletePayment} />
        </Stack>
        <Footer payments={payments} sumAmmount={sumAmmount} />
      </UserSeetingsProvider>
    </ChakraProvider>
  );
}

export default App;
