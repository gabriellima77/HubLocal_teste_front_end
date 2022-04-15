import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";

export default function Empresa() {

}

export const getStaticPaths: GetStaticPaths = async ()=> {
  return {
    paths: [],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context)=> {
  const { id } = context.params;
  // const response = api.get();
  return {
    props: {}
  }
}