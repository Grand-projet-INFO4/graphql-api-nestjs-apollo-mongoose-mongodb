// The possibe payment methods
export enum PaymentMethod {
  Cash = 'CASH', // (En espèce)
  MobileMoney = 'MOBILE_MONEY',
  DebitCard = 'DEBIT_CARD',
  CreditCard = 'CREDIT_CARD',
}
export const paymentMethods = [
  PaymentMethod.Cash,
  PaymentMethod.MobileMoney,
  PaymentMethod.DebitCard,
  PaymentMethod.CreditCard,
];
