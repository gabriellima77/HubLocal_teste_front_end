import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import Router from "next/router";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import { withSSRAuth } from "../../utils/withSSRAuth";

interface EmpresaProps {
  company: {
    id: string;
    name: string;
    description: string;
    cnpj: string;
  };
}

interface IFormData {
  name: string;
  cnpj: string;
  description: string;
}

const editCompanySchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cnpj: yup.string().required("Cnpj Obrigatório!"),
  description: yup.string(),
});

export default function Empresa({ company }: EmpresaProps) {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm<IFormData>({
    resolver: yupResolver(editCompanySchema),
    defaultValues: {
      name: company.name,
      cnpj: company.cnpj,
      description: company.description,
    },
  });

  const onSubmit: SubmitHandler<IFormData> = async ({
    name,
    description,
    cnpj,
  }) => {
    try {
      await api.put(`/empresas/${company.id}`, { name, description, cnpj });
      Router.push("/empresas");
    } catch (error) {
      console.log(error);
    }
  };

  const { errors } = formState;

  return (
    <>
      <Header name={user?.name} hasNavLink />
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            error={errors.name}
            label="Nome"
            type="text"
            {...register("name")}
          />
          <Input
            error={errors.cnpj}
            label="Cnpj"
            type="text"
            {...register("cnpj")}
          />
          <Input
            error={errors.description}
            label="Descrição"
            type="text"
            {...register("description")}
          />
          <button type="submit">Editar</button>
        </form>
        <button type="button">Adicionar Local</button>
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
