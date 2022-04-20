import { GetServerSideProps } from "next";

import { getCompanyId } from "../../utils/CompanyCookies";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface LocationProps {
  id: string;
}

export default function Location({ id }: LocationProps) {
  return <h1>Testando</h1>;
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    let company_id = "";
    try {
      company_id = getCompanyId(context);
    } catch {
      return {
        props: {},
        redirect: {
          destination: "/empresas",
          permanent: false,
        },
      };
    }
    console.log(company_id);
    const { id } = context.params ? context.params : { id: "" };

    return {
      props: {},
    };
  }
);
