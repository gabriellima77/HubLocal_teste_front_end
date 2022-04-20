import { useFormContext } from "react-hook-form";

import { CepInput } from "../CepInput";
import { Input } from "../Input";

interface AddressRequest {
  address: string;
  city: string;
  state: string;
}

interface ResponsibleFormProps {
  locationIndex: number;
  index: number;
}

export function ResponsibleForm({
  index,
  locationIndex,
}: ResponsibleFormProps) {
  const { register, formState, setValue, clearErrors, getValues } =
    useFormContext();

  const { errors } = formState;

  const setAddress = ({ address, city, state }: AddressRequest) => {
    const values = getValues(`locations.${locationIndex}.responsible.${index}`);
    console.log(values);
    setValue(`locations.${locationIndex}.responsible.${index}`, {
      ...values,
      address,
      city,
      state,
    });
    clearErrors(`locations.${locationIndex}.responsible.${index}.address`);
    clearErrors(`locations.${locationIndex}.responsible.${index}.city`);
    clearErrors(`locations.${locationIndex}.responsible.${index}.state`);
  };

  const { responsible } = errors.locations
    ? errors.locations[locationIndex]
    : { responsible: undefined };

  return (
    <div>
      <Input
        label="Nome do responsável"
        type="text"
        error={responsible ? responsible[index].name : undefined}
        {...register(`locations.${locationIndex}.responsible.${index}.name`)}
      />
      <Input
        label="Telefone"
        type="tel"
        error={responsible ? responsible[index].phone : undefined}
        {...register(`locations.${locationIndex}.responsible.${index}.phone`)}
      />
      <CepInput setAddress={setAddress} />
      <Input
        label="Endereço"
        type="text"
        error={responsible ? responsible[index].address : undefined}
        {...register(`locations.${locationIndex}.responsible.${index}.address`)}
        disabled
      />
      <Input
        label="Cidade"
        type="text"
        error={responsible ? responsible[index].city : undefined}
        {...register(`locations.${locationIndex}.responsible.${index}.city`)}
        disabled
      />
      <Input
        label="Estado"
        type="text"
        error={responsible ? responsible[index].state : undefined}
        {...register(`locations.${locationIndex}.responsible.${index}.state`)}
        disabled
      />
    </div>
  );
}
