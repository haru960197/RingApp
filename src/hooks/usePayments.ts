import { useState } from "react";

export class Payment {
  static counter = 0;

  id: number;
  title: string;
  ammount: number;
  date: Date;

  constructor(
    title: string,
    ammount: number,
    date: Date,
    id?: number,
  ) {
    this.id = id ?? Payment.counter++;
    this.title = title;
    this.ammount = ammount;
    this.date = date;
  }
}

interface IPayments {
  payments: Payment[];
  addPayment: (title: string, ammount: number, date: Date) => void;
  editPayment: (id: number, title: string, ammount: number, date: Date) => void;
  deletePayment: (id: number) => void;
}

export const usePayments = (): IPayments => {
  const [payments, setPayments] = useState<Payment[]>(
    ((): Payment[] => {
      const paymentsStr = localStorage.getItem("payments");
      if (paymentsStr) {
        const paymentJsonArr: PaymentJson[] = JSON.parse(paymentsStr);
        return paymentJsonArr.map((paymentJson) => (
          new Payment(
            paymentJson.title,
            paymentJson.ammount,
            new Date(paymentJson.date),
            paymentJson.id,
          )
        ));
      } else {
        return [] as Payment[];
      }
    })()
  );

  const addPayment = (title: string, ammount: number, date: Date) => {
    const newPayment = new Payment(
      title,
      ammount,
      date,
    );
    const newPayments: Payment[] = [...payments, newPayment];
    setPayments(newPayments);
    localStorage.setItem("payments", JSON.stringify(newPayments));
  };

  const editPayment = (id: number, title: string, ammount: number, date: Date) => {
    const editedPayment = new Payment(
      title,
      ammount,
      date,
      id,
    );
    const newPayments: Payment[] = payments.map((payment) => {
      if (payment.id === id) {
        return editedPayment;
      } else {
        return payment;
      }
    });
    setPayments(newPayments);
    localStorage.setItem("payments", JSON.stringify(newPayments));
  }

  const deletePayment = (id: number): void => {
    const newPayments = payments.filter((payment) => payment.id !== id);
    setPayments(newPayments);
    localStorage.setItem("payments", JSON.stringify(newPayments));
  }

  return ({
    payments,
    addPayment,
    editPayment,
    deletePayment,
  } satisfies IPayments);
}

type PaymentJson = {
  id: number,
  title: string,
  ammount: number,
  date: string,
}