import { GetServerSideProps } from "next";

import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface EmpresaProps {
  company: {
    id: string;
    name: string;
    description: string;
    cnpj: string;
    user: string;
  };
}

export default function Empresa({ company }: EmpresaProps) {
  return (
    <>
      <Header name="Testando" hasNavLink />
      <main>
        <h1>{company.name}</h1>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    const { id } = context.params ? context.params : { id: "" };
    const api = setupAPIClient(context);
    const { data: company } = await api.get(`/empresas/${id}`);
    return {
      props: {
        company,
      },
    };
  }
);
