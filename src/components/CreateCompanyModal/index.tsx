import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

import { api } from "../../services/apiClient";
import { Input } from "../Input";
import styles from "./CreateCompanyModal.module.scss";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onRequestClose(): void;
}

interface IFormData {
  name: string;
  cnpj: string;
  description: string;
}

const createCompanySchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cnpj: yup.string().required("Cnpj Obrigatório!"),
  description: yup.string(),
});

export function CreateCompanyModal({
  isOpen,
  onRequestClose,
}: CreateCompanyModalProps) {
  const { register, handleSubmit, formState, reset } = useForm<IFormData>({
    resolver: yupResolver(createCompanySchema),
  });

  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<IFormData> = async ({
    name,
    description,
    cnpj,
  }) => {
    try {
      await api.post("/empresas", { name, description, cnpj });
      reset();
      onRequestClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      className={styles.modal}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <button
        className={styles.closeBtn}
        onClick={onRequestClose}
        type="button"
      >
        x
      </button>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
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

        <button type="submit">{!isSubmitting ? "Criar" : "Criando"}</button>
      </form>
    </Modal>
  );
}
