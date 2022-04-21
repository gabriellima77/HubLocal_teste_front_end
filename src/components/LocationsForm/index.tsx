import { useFieldArray, useFormContext } from "react-hook-form";

import common from "../../styles/common.module.scss";
import { CepInput } from "../CepInput";
import { Input } from "../Input";
import { ResponsibleForm } from "../ResponsibleForm";
import styles from "./LocationsForm.module.scss";

interface AddresRequest {
  address: string;
  city: string;
  state: string;
}

interface LocationsFormProps {
  index: number;
  removeLocation(): void;
}

export function LocationsForm({ removeLocation, index }: LocationsFormProps) {
  const { register, formState, setValue, clearErrors, getValues, control } =
    useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `locations.${index}.responsible`,
  });

  const setAddress = ({ address, city, state }: AddresRequest) => {
    const values = getValues(`locations.${index}`);
    setValue(`locations.${index}`, { ...values, address, city, state });
    clearErrors(`locations.${index}.address`);
    clearErrors(`locations.${index}.city`);
    clearErrors(`locations.${index}.state`);
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

  const removeResponsible = (index: number) => {
    remove(index);
  };

  const { errors } = formState;

  return (
    <div className={styles.container}>
      <Input
        label="Nome do Local"
        type="text"
        error={errors.locations ? errors.locations[index].name : undefined}
        {...register(`locations.${index}.name`)}
      />
      <CepInput setAddress={setAddress} />
      <Input
        label="Endereço"
        type="text"
        error={errors.locations ? errors.locations[index].address : undefined}
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

      <button type="button" onClick={addResponsible}>
        Criar Responsável
      </button>
      {fields.map((field, i) => (
        <ResponsibleForm key={field.id} index={i} locationIndex={index} />
      ))}
      <button
        className={`${common.button} ${styles.buttonRed}`}
        type="button"
        onClick={removeLocation}
      >
        Remover Local
      </button>
    </div>
  );
}
