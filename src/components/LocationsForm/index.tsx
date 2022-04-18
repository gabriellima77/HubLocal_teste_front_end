import { Input } from "../Input";
import styles from "./LocationsForm.module.scss";

export function LocaionsForm({ errors, register, index }) {
  return (
    <form className={styles["location-container"]}>
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
      <button
        className={common.button}
        type="button"
        onClick={() => removeLocation(index)}
      >
        Remover
      </button>
    </form>
  );
}
