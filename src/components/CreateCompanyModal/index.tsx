import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { Input } from "../Input";
import { LocationsForm } from "../LocationsForm";
import styles from "./CreateCompanyModal.module.scss";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onRequestClose(): void;
  onAddCompany(companies: any): void;
}

interface Responsible {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface Location {
  name: string;
  address: string;
  city: string;
  state: string;
  responsible: Responsible[];
}

interface IFormData {
  name: string;
  cnpj: string;
  description: string;
  locations: Location[];
}

const phoneRegex = /\({0,1}\d{2,}\){0,1}\d{4,}-{0,1}\d{4}/g;
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

export const locationSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
  responsible: yup.array().of(responsibleSchema),
});

const createCompanySchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cnpj: yup.string().required("Cnpj Obrigatório!"),
  description: yup.string(),
  locations: yup.array().of(locationSchema),
});

export function CreateCompanyModal({
  isOpen,
  onRequestClose,
  onAddCompany,
}: CreateCompanyModalProps) {
  const methods = useForm<IFormData>({
    resolver: yupResolver(createCompanySchema),
  });

  const { control, register, handleSubmit, formState, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const { errors, isSubmitting } = formState;

  const onSubmit = async ({
    cnpj,
    description,
    locations,
    name,
  }: IFormData) => {
    try {
      await api.post("/empresas", { name, description, cnpj });
      const promises = [];
      for (let i = 0; i < locations.length; i += 1) {
        const location = {
          name: locations[i].name,
          address: locations[i].address,
          city: locations[i].city,
          state: locations[i].state,
        };
        promises.push(api.post("/locais", location, {}));
      }
      const { data: newCompanies } = await api.get("/empresas");
      onAddCompany(newCompanies);
      reset();
      onRequestClose();
    } catch (error) {
      console.log(error);
    }
  };

  const addLocationField = () => {
    append({ address: "", city: "", name: "", state: "" });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  return (
    <FormProvider {...methods}>
      <Modal
        className={styles.modal}
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.4)" } }}
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

          {fields.map((field, index) => (
            <LocationsForm
              key={field.id}
              index={index}
              removeLocation={() => removeField(index)}
            />
          ))}

          <button
            className={common.button}
            onClick={addLocationField}
            type="button"
          >
            Adicionar Local
          </button>
        </form>

        <button
          className={common.button}
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {!isSubmitting ? "Criar" : "Criando"}
        </button>
      </Modal>
    </FormProvider>
  );
}
