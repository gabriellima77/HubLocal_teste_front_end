import Head from "next/head";
import { Header } from "../components/Header";

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