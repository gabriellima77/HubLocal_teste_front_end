import { useFormContext } from "react-hook-form";
import ReactModal from "react-modal";

import common from "../../styles/common.module.scss";
import { CepInput } from "../CepInput";
import { Input } from "../Input";

ReactModal.setAppElement("#__next");

interface AddressRequest {
  address: string;
  city: string;
  state: string;
}

interface ResponsibleFormProps {
  locationIndex?: number;
  index: number;
  removeResponsible(index: number): void;
}

export function ResponsibleForm({
  index,
  locationIndex,
  removeResponsible,
}: ResponsibleFormProps) {
  const { register, formState, setValue, clearErrors, getValues } =
    useFormContext();

  const { errors } = formState;
  const position =
    locationIndex !== undefined
      ? `locations.${locationIndex}.responsible.`
      : "responsible.";

  const setAddress = ({ address, city, state }: AddressRequest) => {
    const values = getValues(`${position}${index}`);
    setValue(`${position}${index}`, {
      ...values,
      address,
      city,
      state,
    });
    clearErrors(`${position}${index}.address`);
    clearErrors(`${position}${index}.city`);
    clearErrors(`${position}${index}.state`);
  };

  let { responsible } = errors;
  if (locationIndex !== undefined) {
    responsible = errors.locations
      ? errors.locations[locationIndex].responsible
      : undefined;
  }

  return (
    <>
      <Input
        label="Nome do responsável"
        type="text"
        error={responsible ? responsible[index].name : undefined}
        {...register(`${position}${index}.name`)}
      />
      <Input
        label="Telefone"
        type="tel"
        error={responsible ? responsible[index].phone : undefined}
        {...register(`${position}${index}.phone`)}
      />
      <CepInput setAddress={setAddress} />
      <Input
        label="Endereço"
        type="text"
        error={responsible ? responsible[index].address : undefined}
        {...register(`${position}${index}.address`)}
        disabled
      />
      <Input
        label="Cidade"
        type="text"
        error={responsible ? responsible[index].city : undefined}
        {...register(`${position}${index}.city`)}
        disabled
      />
      <Input
        label="Estado"
        type="text"
        error={responsible ? responsible[index].state : undefined}
        {...register(`${position}${index}.state`)}
        disabled
      />
      <button
        style={{ backgroundColor: "rgb(252, 80, 80)" }}
        className={common.button}
        onClick={() => removeResponsible(index)}
        type="button"
      >
        Remover responsável
      </button>
    </>
  );
}
