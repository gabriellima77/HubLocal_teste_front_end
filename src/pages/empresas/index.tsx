import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import ReactModal from "react-modal";

import { CreateCompanyModal } from "../../components/CreateCompanyModal";
import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRAuth } from "../../utils/withSSRAuth";
import styles from "./Empresas.module.scss";

ReactModal.setAppElement("#__next");

export default function Empresas() {
  const { user } = useContext(AuthContext);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] =
    useState(false);

  const openModal = () => {
    setIsCreateCompanyModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateCompanyModalOpen(false);
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
        />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    return {
      props: {},
    };
  }
);
