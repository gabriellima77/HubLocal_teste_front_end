import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { Input } from "../Input";
import styles from "./CreateCompanyModal.module.scss";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onRequestClose(): void;
  onAddCompany(companies: any): void;
}

type Responsible = {
  name: string;
  phone: string;
  cep: string;
  address: string;
  city: string;
  state: string;
};

type Location = {
  name: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  responsible: string;
};

interface IFormData {
  name: string;
  cnpj: string;
  description: string;
  locations: Location[];
  responsible: Responsible[];
}

interface AddressResponse {
  bairro: string;
  localidade: string;
  logradouro: string;
  uf: string;
}

const phoneRegex = /\({0,1}\d{2,}\){0,1}\d{4,}-{0,1}\d{4}/g;
const cepRegex = /[0-9]{5}-{0,1}[0-9]{3}/g;

const responsibleSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  phone: yup.string().required("Telefone obrigatório").matches(phoneRegex),
  cep: yup.string().required("CEP obrigatório").matches(cepRegex),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
});

const locationSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cep: yup.string().required("CEP obrigatório").matches(cepRegex),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
  responsible: yup.string().required("Responsável obrigatório!"),
});

const createCompanySchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  cnpj: yup.string().required("Cnpj Obrigatório!"),
  description: yup.string(),
  locations: yup.array().of(locationSchema),
  responsibleSchema: yup.array().of(responsibleSchema),
});

export function CreateCompanyModal({
  isOpen,
  onRequestClose,
  onAddCompany,
}: CreateCompanyModalProps) {
  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    getValues,
    setError,
    setValue,
  } = useForm<IFormData>({
    resolver: yupResolver(createCompanySchema),
  });

  const {
    append: appendLocation,
    fields: locationsFields,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: "locations",
  });

  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<IFormData> = async ({
    name,
    description,
    cnpj,
    locations,
    responsible,
  }) => {
    try {
      await api.post("/empresas", { name, description, cnpj });
      const { data: newCompanies } = await api.get("/empresas");
      onAddCompany(newCompanies);
      reset();
      onRequestClose();
    } catch (error) {
      console.log(error);
    }
  };

  const addLocationField = () => {
    appendLocation({
      name: "",
      cep: "",
      address: "",
      city: "",
      state: "",
      responsible: "",
    });
  };

  const verifyCEP = async (index: number) => {
    const location = getValues(`locations.${index}`);
    const isValid = location.cep.match(cepRegex);

    if (!isValid) {
      setError(`locations.${index}.cep`, { message: "CEP Inválido!" });
      return;
    }

    location.cep = location.cep.replace("-", "");
    const response = await fetch(
      `http://viacep.com.br/ws/${location.cep}/json/`
    );
    const { bairro, localidade, logradouro, uf }: AddressResponse =
      await response.json();
    const newLocation = {
      ...location,
      address: `${logradouro}, ${bairro}`,
      city: localidade,
      state: uf,
    };

    setValue(`locations.${index}`, newLocation);
  };

  return (
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
      </form>
      {locationsFields.map((field, index) => (
        <form className={styles["location-container"]} key={field.id}>
          <legend>{`Local ${index + 1}`}</legend>
          <Input
            label="Nome do Local"
            type="text"
            error={errors.locations ? errors.locations[index]?.name : undefined}
            {...register(`locations.${index}.name`)}
          />
          <Input
            label="Responsável"
            type="text"
            error={
              errors.locations ? errors.locations[index].responsible : undefined
            }
            {...register(`locations.${index}.responsible`)}
          />
          <Input
            label="CEP"
            type="text"
            error={errors.locations ? errors.locations[index].cep : undefined}
            {...register(`locations.${index}.cep`)}
          />
          <button
            className={common.button}
            onClick={() => verifyCEP(index)}
            type="button"
          >
            Verificar CEP
          </button>
          <Input
            label="Endereço"
            type="text"
            error={
              errors.locations ? errors.locations[index].address : undefined
            }
            {...register(`locations.${index}.address`)}
            disabled
          />
          <Input
            label="Cidade"
            type="text"
            error={errors.locations ? errors.locations[index].city : undefined}
            {...register(`locations.${index}.city`)}
            disabled
          />
          <Input
            label="Estado"
            type="text"
            error={errors.locations ? errors.locations[index].state : undefined}
            {...register(`locations.${index}.state`)}
            disabled
          />
          <button
            className={common.button}
            type="button"
            onClick={() => removeLocation(index)}
          >
            Remover
          </button>
        </form>
      ))}
      <button
        className={common.button}
        onClick={addLocationField}
        type="button"
      >
        Adicionar Local
      </button>
      <button
        className={common.button}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        {!isSubmitting ? "Criar" : "Criando"}
      </button>
    </Modal>
  );
}
