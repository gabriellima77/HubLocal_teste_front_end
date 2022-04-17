import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import ReactModal from "react-modal";

import { CompanyItem } from "../../components/CompanyItem";
import { CreateCompanyModal } from "../../components/CreateCompanyModal";
import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import { withSSRAuth } from "../../utils/withSSRAuth";
import styles from "./Empresas.module.scss";

ReactModal.setAppElement("#__next");

interface Company {
  name: string;
  id: string;
  description: string;
  cnpj: string;
}

interface EmpresasProps {
  companies: Company[];
}

export default function Empresas({ companies }: EmpresasProps) {
  const { user } = useContext(AuthContext);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState(false);
  const [companiesList, setCompaniesList] = useState<Company[]>(companies);

  const openModal = () => {
    setIsCreateCompanyModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateCompanyModalOpen(false);
  };

  const addCompany = (newCompanies: Company[]) => {
    setCompaniesList(newCompanies);
  };

  return (
    <div>
      <Head>
        <title>Empresas</title>
      </Head>
      <Header name={user ? user.name : ""} />
      <main className={styles.container}>
        <button className={styles.createBtn} onClick={openModal} type="button">
          Cadastrar nova empresa
        </button>
        <CreateCompanyModal
          isOpen={isCreateCompanyModalOpen}
          onRequestClose={closeModal}
          onAddCompany={addCompany}
        />
        <ul>
          {companiesList.map((company) => (
            <CompanyItem
              key={company.id}
              company={company.name}
              id={company.id}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    const api = setupAPIClient(context);
    const { data: companies } = await api.get("/empresas");

    return {
      props: {
        companies,
      },
    };
  }
);
