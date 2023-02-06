import DisplayInvoice from "@/components/DisplayInvoice";
import { Invoice } from "@/components/InvoiceList";
import axios from "axios";
import * as uuid from "uuid";
import { useRouter } from "next/router";

const Invoice = ({ invoice }: { invoice: Invoice }) => {
  console.log(invoice);
  return <DisplayInvoice invoice={invoice} />;
};

export async function getServerSideProps(context: {
  query: { id: string; create: boolean };
}) {
  const { id, create } = context.query;

  if (!create) {
    const result = await axios.get(`http://localhost:3000/api/item?id=${id}`);
    return {
      props: { invoice: result.data },
    };
  } else {
    return {
      props: {
        invoice: {
          id: { S: id },
          CustomerName: { S: "Enter Customer Name" },
          InvoiceDate: { N: `${new Date().getTime()}` },
          Services: {
            L: [
              {
                M: {
                  Key: { S: uuid.v1() },
                  Service: { S: "Web Design" },
                  Description: { S: "Added Content to a Website" },
                  Cost: { N: "60" },
                  Quantity: { N: "1" },
                },
              },
            ],
          },
          Paid: { N: "0" },
        },
      },
    };
  }
}

export default Invoice;
