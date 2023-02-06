import * as uuid from "uuid";
import { useRouter } from "next/router";

const NewInvoice = () => {
  return <></>;
};

export async function getServerSideProps() {
  const id = uuid.v1();
  return {
    redirect: {
      destination: `/invoice/${id}?create=true`,
      permanent: false,
    },
  };
}

export default NewInvoice;
