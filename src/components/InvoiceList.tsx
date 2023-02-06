import { Button, IconButton } from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useState } from "react";

export interface InvoiceProps {
  invoices: Invoice[];
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
  const [invoiceData, setInvoiceDate] = useState(invoices);

  const deleteInvoice = async (id: string) => {
    if (window.confirm("Delete This Invoice?")) {
      const result = await axios.delete("/api/item", {
        data: { id: id },
      });

      if (result.status === 204) {
        const newInvoices = invoiceData.filter((i) => i.id.S !== id);
        setInvoiceDate(newInvoices);
      }
    }
  };

  return (
    <div>
      <p>
        <Button LinkComponent={Link} href="/invoice/new">
          New Invoice
        </Button>
      </p>
      <ul>
        {invoiceData.map((invoice: Invoice) => (
          <li key={invoice.id.S}>
            <Link href={`/invoice/${invoice.id.S}`}>
              {invoice.CustomerName.S} -{" "}
              {new Date(parseInt(invoice.InvoiceDate.N)).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </Link>{" "}
            <IconButton onClick={async () => await deleteInvoice(invoice.id.S)}>
              <DeleteIcon />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceList;
