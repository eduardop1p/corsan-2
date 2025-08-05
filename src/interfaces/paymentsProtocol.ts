export default interface PaymentsProtocol {
  value: number;
  idDocument: string;
  registration: string;
  location: string;
  copied: boolean;
  createdIn: Date;
}
