import { Button } from "@mui/material";
import Link from "next/link";

export interface InvoiceProps {
  invoices: [Invoice];
}

export interface Invoice {
  id: { S: string };
  CustomerName: { S: string };
  InvoiceDate: { N: string };
  Services: { L: [Service] };
  Paid: { N: string };
}

export interface Service {
  M: {
    Key: { S: string };
    Service: { S: string };
    Description: { S: string };
    Cost: { N: string };
    Quantity: { N: string };
  };
}

const InvoiceList = ({ invoices }: InvoiceProps) => {
  console.log(invoices);
  return (
    <div>
      <p>
        <Button LinkComponent={Link} href="/invoice/new">
          New Invoice
        </Button>
      </p>
      <ul>
        {invoices.map((invoice: Invoice) => (
          <li key={invoice.id.S}>
            <Link href={`/invoice/${invoice.id.S}`}>
              {invoice.CustomerName.S} -{" "}
              {new Date(parseInt(invoice.InvoiceDate.N)).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
