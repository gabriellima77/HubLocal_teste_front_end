import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { Header } from "../../components/Header";
import { withSSRAuth } from "../../utils/withSSRAuth";

export default function Empresas() {
  return (
    <div>
      <Head>
        <title>Empresas</title>
      </Head>
      <Header name="Gabriel" />
      <form>
        <button>Cadastrar nova empresa</button>
        <ul>
        </ul>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth (
  async (context) => {
  return {
    props: {}
  }
});