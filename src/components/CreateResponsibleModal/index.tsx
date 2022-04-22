import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { CepInput } from "../CepInput";
import { Input } from "../Input";
import styles from "./CreateResponsibleModal.module.scss";

interface AddresRequest {
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

interface CreateResponsibleModalProps {
  responsible: Responsible;
  companyId: string;
  locationId: string;
  isOpen: boolean;
  onRequestClose(): void;
  onAddResponsible(Responsible: Responsible[]): void;
  submitEvent(responsible: Responsible): Promise<void>;
}

const phoneRegex = /^\({0,1}\d{2,}\){0,1}[ ]{0,1}\d{4,}-{0,1}\d{4}$/;
export const responsibleSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  phone: yup
    .string()
    .required("Telefone obrigatório")
    .matches(phoneRegex, "Telefone deve seguir o padrão (55)91234-1234"),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
});

function CreateResponsibleModal({
  responsible,
  companyId,
  isOpen,
  locationId,
  onAddResponsible,
  onRequestClose,
  submitEvent,
}: CreateResponsibleModalProps) {
  const methods = useForm<Responsible>({
    resolver: yupResolver(responsibleSchema),
    defaultValues: {
      address: responsible.address,
      city: responsible.city,
      name: responsible.name,
      phone: responsible.phone,
      state: responsible.state,
    },
  });

  const { register, handleSubmit, formState, reset, setValue, clearErrors } =
    methods;

  const { errors, isSubmitting } = formState;

  useEffect(() => {
    const { address, city, name, phone, state } = responsible;
    setValue("name", name);
    setValue("address", address);
    setValue("city", city);
    setValue("phone", phone);
    setValue("state", state);
  }, [responsible]);

  const setAddress = ({ address, city, state }: AddresRequest) => {
    setValue("address", address);
    setValue("city", city);
    setValue("state", state);
    clearErrors("address");
    clearErrors("city");
    clearErrors("state");
  };

  const onSubmit = async ({
    address,
    phone,
    city,
    name,
    state,
  }: Responsible) => {
    const newResponsible = {
      address,
      city,
      phone,
      name,
      state,
    };

    if (responsible) Object.assign(newResponsible, { id: responsible.id });

    await submitEvent(newResponsible);

    const { data } = await api.get<Responsible[]>("/responsaveis", {
      headers: { company_id: companyId, location_id: locationId },
    });

    onRequestClose();
    reset();
    onAddResponsible(data);
  };

  let buttonText = responsible.name
    ? "Editar responsável"
    : "Criar responsável";
  if (isSubmitting) {
    buttonText = responsible.name
      ? "Editando responsável..."
      : "Criando responsável...";
  }

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onRequestClose={() => {
        reset();
        onRequestClose();
      }}
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
    >
      <button
        className={styles.closeBtn}
        onClick={() => {
          reset();
          onRequestClose();
        }}
        type="button"
      >
        x
      </button>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome do Responsável"
          type="text"
          error={errors.name}
          {...register("name")}
        />
        <Input
          label="Telefone"
          type="tel"
          error={errors.phone}
          {...register("phone")}
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
          {buttonText}
        </button>
      </form>
    </Modal>
  );
}

export { CreateResponsibleModal };
