import { yupResolver } from "@hookform/resolvers/yup";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactModal from "react-modal";
import * as yup from "yup";

import { CepInput } from "../../components/CepInput";
import { CreateResponsibleModal } from "../../components/CreateResponsibleModal";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { ResponsibleItem } from "../../components/ResponsibleItem";
import { AuthContext } from "../../contexts/AuthContext";
import { setupAPIClient } from "../../services/api";
import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { getCompanyId } from "../../utils/CompanyCookies";
import { withSSRAuth } from "../../utils/withSSRAuth";
import styles from "./Local.module.scss";

interface Ticket {
  id: string;
  status: "pendente" | "progresso" | "concluido";
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface Responsible {
  id?: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface LocationProps {
  location: Location;
  companyId: string;
  responsible: Responsible[];
}

interface IFormData {
  name: string;
  address: string;
  city: string;
  state: string;
}

interface AddresRequest {
  address: string;
  city: string;
  state: string;
}

ReactModal.setAppElement("#__next");

export const locationSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
});

export default function Location({
  location,
  companyId,
  responsible,
}: LocationProps) {
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [responsibleToEdit, setResponsibleToEdit] = useState<Responsible>();
  const [responsibleList, setResponsibleList] =
    useState<Responsible[]>(responsible);
  const { user } = useContext(AuthContext);
  const methods = useForm<IFormData>({
    resolver: yupResolver(locationSchema),
    defaultValues: {
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
    },
  });

  const onModalOpen = () => {
    setIsResponsibleModalOpen(true);
  };

  const onModalClose = () => {
    setResponsibleToEdit(undefined);
    setIsResponsibleModalOpen(false);
  };

  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    clearErrors,
  } = methods;

  const { errors, isSubmitting } = formState;

  const setAddress = ({ address, city, state }: AddresRequest) => {
    setValue("address", address);
    setValue("city", city);
    setValue("state", state);
    clearErrors("address");
    clearErrors("city");
    clearErrors("state");
  };

  const onRemoveResponsible = (id: string) => {
    setResponsibleList((prev) =>
      prev.filter((responsible) => responsible.id !== id)
    );
  };

  const onAddResponsible = (responsible: Responsible[]) => {
    setResponsibleList(responsible);
  };

  const submitEvent = async ({
    address,
    city,
    name,
    phone,
    state,
    id,
  }: Responsible) => {
    const responsible = {
      address,
      city,
      name,
      phone,
      state,
    };
    if (id) {
      Object.assign(responsible, { id, isMain: false });
      await api.put(`/responsaveis/${id}`, responsible, {
        headers: { company_id: companyId, location_id: location.id },
      });
    } else {
      await api.post("/responsaveis", responsible, {
        headers: { company_id: companyId, location_id: location.id },
      });
    }
  };

  const onEdit = (id: string) => {
    const responsible = responsibleList.find((respo) => respo.id === id);
    setResponsibleToEdit(responsible);
    onModalOpen();
  };

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    try {
      await api.put(`/locais/${location.id}`, data, {
        headers: {
          company_id: companyId,
        },
      });

      // update last Ticket or Create new Ticket
      const headers = {
        company_id: companyId,
        location_id: location.id,
      };
      const { data: tickets } = await api.get("/tickets/local", {
        headers,
      });
      const hasTicketOpen = tickets.find(
        (ticket: Ticket) => ticket.status !== "concluido"
      );
      if (hasTicketOpen) {
        const { id } = hasTicketOpen;
        await api.put(`/tickets/${id}`, { status: "progresso" }, { headers });
      } else {
        await api.post(
          "/tickets",
          {
            created_by: user?.name,
            will_solve: user?.name,
          },
          {
            headers,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>Locais | {location.name}</title>
      </Head>
      <Header name={user?.name} hasNavLink />
      <CreateResponsibleModal
        companyId={companyId}
        isOpen={isResponsibleModalOpen}
        onRequestClose={onModalClose}
        onAddResponsible={onAddResponsible}
        locationId={location.id}
        submitEvent={submitEvent}
        responsible={responsibleToEdit}
      />
      <main className={styles.container}>
        <h3 className={styles["location-header"]}>Editar {location.name}</h3>
        <form
          className={styles["form-container"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Nome do Local"
            type="text"
            error={errors.name}
            {...register("name")}
          />
          <CepInput setAddress={setAddress} />
          <Input
            label="Endereço"
            type="text"
            error={errors.address}
            {...register("address")}
            disabled
          />
          <Input
            label="Cidade"
            type="text"
            error={errors.city}
            {...register("city")}
            disabled
          />
          <Input
            label="Estado"
            type="text"
            error={errors.state}
            {...register("state")}
            disabled
          />
          <button className={common.button} type="submit">
            {isSubmitting ? "Editando..." : "Editar"}
          </button>
        </form>
        <h3 className={styles["location-header"]}>Responsáveis</h3>
        <button onClick={onModalOpen} className={common.button} type="button">
          Adicionar Responsável
        </button>
        <ul className={styles.list}>
          {responsibleList.map((responsible) => (
            <ResponsibleItem
              key={responsible.id}
              companyId={companyId}
              locationId={location.id}
              id={String(responsible.id)}
              onRemoveResponsible={onRemoveResponsible}
              responsible={responsible.name}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => {
    let company_id = "";
    try {
      company_id = getCompanyId(context);
    } catch {
      return {
        props: {
          location: {},
          companyId: company_id,
          responsible: [],
        },
        redirect: {
          destination: "/empresas",
          permanent: false,
        },
      };
    }
    const api = setupAPIClient(context);
    const { id } = context.params ? context.params : { id: "" };
    const { data } = await api.get(`/locais/${id}`, {
      headers: {
        company_id,
      },
    });

    const { data: responsible } = await api.get("/responsaveis", {
      headers: {
        company_id,
        location_id: String(id),
      },
    });

    const location = {
      id: data.id,
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
    };

    return {
      props: {
        location,
        companyId: company_id,
        responsible,
      },
    };
  }
);
