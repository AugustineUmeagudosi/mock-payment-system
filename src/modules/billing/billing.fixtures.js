import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

const customerId = uuidv4();
const id = uuidv4();

export const customerNotExist = {
  customerId,
  amount: faker.finance.amount(),
  paymentMode: "cash"
};

export const transactionInfo = {
  customerId: "fd7092f0-a1f5-48cc-a697-563c242557ad",
  amount: faker.finance.amount(),
  paymentMode: "cash"
};

export const wrongCustomerId = {
  customerId: "ejjwdjk234",
  amount: faker.finance.amount(),
  paymentMode: "cash"
};

export const noCustomerId = {
  amount: faker.finance.amount(),
  paymentMode: "cash"
};

export const noAmount = {
  customerId,
  paymentMode: "cash"
};

export const wrongAmount = {
  customerId,
  amount: "faker.finance.amount()",
  paymentMode: "credit card"
};

export const noPaymentMode = {
  customerId,
  amount: faker.finance.amount(),
};

export const wrongPaymentMode = {
  customerId,
  amount: faker.finance.amount(),
  paymentMode: "credit card"
};

export const customerInfo = {
  id,
  name: "Austin",
  email: "test@example.com"
};