import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext } from "react";

import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import { getCompanyId } from "../../utils/CompanyCookies";
import { withSSRAuth } from "../../utils/withSSRAuth";

type ticket = {
  id: string;
  title: string;
};

interface TicketsProps {
  company: string;
  tickets: ticket[];
}

export default function Tickets({ tickets, company }: TicketsProps) {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Head>
        <title>{company} | Tickets</title>
      </Head>
      <Header name={user?.name} hasNavLink />
      <main>
        <h3>Tickets da empresa {company}</h3>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    const companyId = getCompanyId(context);
    if (!companyId) {
      return {
        props: {},
        redirect: {
          destination: "/empresas",
          permanent: false,
        },
      };
    }

    const api = setupAPIClient(context);
    const { data: company } = await api.get(`/empresas/${companyId}`);
    const { data: tickets } = await api.get("/tickets", {
      headers: { company_id: companyId },
    });
    return {
      props: {
        tickets,
        company: company.name,
      },
    };
  }
);
