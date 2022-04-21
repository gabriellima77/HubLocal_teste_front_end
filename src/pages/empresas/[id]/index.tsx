import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactModal from "react-modal";
import * as yup from "yup";

import { CreateLocationModal } from "../../../components/CreateLocationModal";
import { Header } from "../../../components/Header";
import { Input } from "../../../components/Input";
import { LocationItem } from "../../../components/LocationItem";
import { AuthContext } from "../../../contexts/AuthContext";
import { setupAPIClient } from "../../../services/api";
import { api } from "../../../services/apiClient";
import common from "../../../styles/common.module.scss";
import { setCompany } from "../../../utils/CompanyCookies";
import { withSSRAuth } from "../../../utils/withSSRAuth";
import styles from "./Empresa.module.scss";

type Location = {
  id: string;
  name: string;
};

interface EmpresaProps {
  company: {
    id: string;
    name: string;
    description: string;
    cnpj: string;
  };

  locations: Location[];
}

interface IFormData {
  name: string;
  cnpj: string;
  description: string;
}

ReactModal.setAppElement("#__next");

const editCompanySchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cnpj: yup.string().required("Cnpj Obrigatório!"),
  description: yup.string(),
});

export default function Empresa({ company, locations }: EmpresaProps) {
  const [locationsList, setLocationsList] = useState<Location[]>(locations);
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] =
    useState(false);
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm<IFormData>({
    resolver: yupResolver(editCompanySchema),
    defaultValues: {
      name: company.name,
      cnpj: company.cnpj,
      description: company.description,
    },
  });

  useEffect(() => {
    setCompany(company.id);
  }, []);

  const openModal = () => {
    setIsCreateLocationModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateLocationModalOpen(false);
  };

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

  const onAddLocation = (locations: Location[]) => {
    setLocationsList(locations);
  };

  const onRemoveLocation = (id: string) => {
    setLocationsList((prev) => prev.filter((location) => location.id !== id));
  };

  const { errors } = formState;

  return (
    <>
      <Head>
        <title>Empresa | {company.name}</title>
      </Head>
      <Header name={user?.name} hasNavLink />
      <main className={styles.container}>
        <form
          className={styles["form-container"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            error={errors.name}
            label="Nome"
            type="text"
            {...register("name")}
          />
          <Input
            error={errors.cnpj}
            label="CNPJ"
            type="text"
            {...register("cnpj")}
          />
          <Input
            error={errors.description}
            label="Descrição"
            type="text"
            {...register("description")}
          />
          <button className={common.button} type="submit">
            Editar
          </button>
        </form>
        <CreateLocationModal
          isOpen={isCreateLocationModalOpen}
          onRequestClose={closeModal}
          onAddLocation={onAddLocation}
          company_id={company.id}
        />
        <button onClick={openModal} className={common.button} type="button">
          Adicionar Local
        </button>
        <h3 className={styles["locations-header"]}>Locais</h3>
        <ul className={styles.list}>
          {locationsList.map((location) => (
            <LocationItem
              key={location.id}
              location={location.name}
              id={location.id}
              company_id={company.id}
              onRemoveLocation={onRemoveLocation}
            />
          ))}
        </ul>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    const { id } = context.params ? context.params : { id: "" };
    const api = setupAPIClient(context);
    const { data: company } = await api.get(`/empresas/${id}`);
    const { data } = await api.get(`/locais`, {
      headers: { company_id: String(id) },
    });

    const locations = data.map(({ id, name }: Location) => ({ id, name }));
    return {
      props: {
        company,
        locations,
      },
    };
  }
);
