import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import InvoiceList, { InvoiceProps } from "@/components/InvoiceList";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ invoices }: InvoiceProps) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InvoiceList invoices={invoices} />
    </>
  );
}

export async function getServerSideProps() {
  const result = await axios.get("http://localhost:3000/api/item");
  return {
    props: { invoices: result.data },
  };
}
