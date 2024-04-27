import { useEffect, useState } from "react";

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
  sumAmmount: number;
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
  const [sumAmmount, setSumAmmount] = useState<number>(0);
  useEffect(() => {
    let sum = 0;
    payments.forEach((payment) => sum += payment.ammount);
    setSumAmmount(sum);
  }, [payments]);

  const addPayment = (title: string, ammount: number, date: Date) => {
    const newPayment = new Payment(
      title,
      ammount,
      date,
    );
    const newPayments: Payment[] = [...payments, newPayment];
    setNewPayments(newPayments);
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
    setNewPayments(newPayments);
  }

  const deletePayment = (id: number): void => {
    const newPayments = payments.filter((payment) => payment.id !== id);
    setNewPayments(newPayments);
  }

  const setNewPayments = (newPayments: Payment[]): void => {
    // 日付順にソート
    newPayments.sort((a, b) => a.date > b.date ? 1 : -1);
    // set
    setPayments(newPayments);
    // localStorageに保存
    localStorage.setItem("payments", JSON.stringify(newPayments));
  }

  return ({
    payments,
    sumAmmount,
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