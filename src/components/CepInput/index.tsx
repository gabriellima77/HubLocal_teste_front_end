import { useState } from "react";
import { FieldError } from "react-hook-form";

import common from "../../styles/common.module.scss";
import { Input } from "../Input";

const cepRegex = /[0-9]{5}-{0,1}[0-9]{3}/g;

interface AddressResponse {
  bairro: string;
  localidade: string;
  logradouro: string;
  uf: string;
}

type setAddressRequest = {
  address: string;
  city: string;
  state: string;
};

interface CepInputProps {
  setAddress(data: setAddressRequest): void;
}

export function CepInput({ setAddress }: CepInputProps) {
  const [CEP, setCEP] = useState("");
  const [error, setError] = useState<FieldError>();

  const verifyCEP = async () => {
    const isValid = CEP.match(cepRegex);

    if (!isValid) {
      setError({ message: "CEP Inválido!", type: "validate" });
      return;
    }
    setError(undefined);
    const cep = CEP.replace("-", "");

    const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`);
    const { bairro, localidade, logradouro, uf }: AddressResponse =
      await response.json();
    const newLocation = {
      address: `${logradouro}, ${bairro}`,
      city: localidade,
      state: uf,
    };

    setAddress(newLocation);
  };

  return (
    <>
      <Input
        value={CEP}
        onChange={(e) => setCEP(e.target.value)}
        label="CEP"
        type="text"
        error={error}
        name="cep"
      />
      <button className={common.button} onClick={verifyCEP} type="button">
        Verificar CEP
      </button>
    </>
  );
}
