import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface User {
  name: string;
  email: string;
  id: string;
}

export default function Empresas() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Head>
        <title>Empresas</title>
      </Head>
      <Header name={user ? user.name : ""} />
      <form>
        <button type="button">Cadastrar nova empresa</button>
        <ul />
      </form>
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
