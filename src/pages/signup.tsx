import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import styles from "../styles/common.module.scss";
import { withSSRGuest } from "../utils/withSSRGuest";

interface IFormData {
  name: string;
  email: string;
  password_confirmation: string;
  password: string;
}

const signUpFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório!").email("E-mail inválido!"),
  password: yup.string().required("Senha obrigatória!"),
  name: yup.string().required("O nome é obrigatório!"),
  password_confirmation: yup
    .string()
    .oneOf([null, yup.ref("password")], "As senhas precisam ser iguais!"),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: yupResolver(signUpFormSchema),
  });

  const { signUp } = useContext(AuthContext);

  const onSubmit: SubmitHandler<IFormData> = async ({
    email,
    password,
    name,
  }) => {
    try {
      await signUp({ email, name, password });
    } catch (err: any) {
      const { error } = err.response.data;
      console.log(error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>SignUp</title>
      </Head>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <h2>SignIn</h2>
        <Input
          error={errors.email}
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
        />
        <Input
          error={errors.password}
          label="Senha"
          type="password"
          {...register("password")}
        />
        <Input
          error={errors.password_confirmation}
          label="Confirmação da senha"
          type="password"
          {...register("password_confirmation")}
        />
        <Input
          error={errors.name}
          label="Nome"
          type="text"
          {...register("name")}
        />
        <Button>SignUp</Button>
        <Link href="/" passHref>
          <a href="replace">Login</a>
        </Link>
      </form>
    </div>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
