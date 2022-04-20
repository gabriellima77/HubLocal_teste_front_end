import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

import { api } from "../../services/apiClient";
import common from "../../styles/common.module.scss";
import { CepInput } from "../CepInput";
import { Input } from "../Input";
import { ResponsibleForm } from "../ResponsibleForm";
import styles from "./CreateLocationModal.module.scss";

interface AddresRequest {
  address: string;
  city: string;
  state: string;
}

interface Responsible {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

interface IFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  responsible: Responsible[];
}

interface CreateResponsibleProps {
  responsible: Responsible[];
  ids: {
    company_id: string;
    location_id: string;
  };
}

interface CreateLocationModalProps {
  company_id: string;
  isOpen: boolean;
  onRequestClose(): void;
  onAddLocation(locations: any): void;
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

export const createLocationSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório!"),
  address: yup.string().required("Endereço obrigatório!"),
  city: yup.string().required("Cidade obrigatória!"),
  state: yup.string().required("Estado obrigatório!"),
  responsible: yup.array().of(responsibleSchema),
});

function CreateLocationModal({
  company_id,
  isOpen,
  onRequestClose,
  onAddLocation,
}: CreateLocationModalProps) {
  const methods = useForm<IFormData>({
    resolver: yupResolver(createLocationSchema),
  });

  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    clearErrors,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "responsible",
  });

  const { errors, isSubmitting } = formState;

  const setAddress = ({ address, city, state }: AddresRequest) => {
    setValue("address", address);
    setValue("city", city);
    setValue("state", state);
    clearErrors("address");
    clearErrors("city");
    clearErrors("state");
  };

  const addResponsible = () => {
    append({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
    });
  };

  const createResponsible = async ({
    ids,
    responsible,
  }: CreateResponsibleProps): Promise<void> => {
    const promises = [];
    for (let i = 0; i < responsible.length; i += 1) {
      const newResponsible = {
        name: responsible[i].name,
        phone: responsible[i].phone,
        address: responsible[i].address,
        city: responsible[i].city,
        state: responsible[i].state,
        isMain: false,
      };
      promises.push(
        api.post("/responsaveis", newResponsible, { headers: ids })
      );
    }
    await Promise.all(promises);
  };

  const onSubmit = async ({
    address,
    city,
    name,
    responsible,
    state,
  }: IFormData) => {
    const location = {
      address,
      city,
      name,
      state,
    };
    const { data } = await api.post("/locais", location, {
      headers: { company_id },
    });
    const { id: location_id } = data;

    await createResponsible({ responsible, ids: { company_id, location_id } });

    const { data: locations } = await api.get("/locais", {
      headers: { company_id },
    });
    onRequestClose();
    reset();
    onAddLocation(locations);
  };

  const removeResponsible = (index: number) => {
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

          <button type="button" onClick={addResponsible}>
            Criar Responsável
          </button>
          {fields.map((field, index) => (
            <ResponsibleForm key={field.id} index={index} />
          ))}
          <button className={common.button} type="submit">
            {isSubmitting ? "Criando Local" : "Criar Local"}
          </button>
        </form>
      </Modal>
    </FormProvider>
  );
}

export { CreateLocationModal };
