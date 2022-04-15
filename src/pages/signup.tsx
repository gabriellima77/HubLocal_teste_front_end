import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from '../services/api';
import styles from '../styles/common.module.scss';

interface IFormData {
  name: string;
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
  password: yup.string().required('Senha obrigatória!'),
  name: yup.string().required('O nome é obrigatório!'),
});

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<IFormData> = async ({email, password, name}) => {
    try {
      const { data } = await api.post("/users/signup", {
        email,
        password,
        name
      });
      console.log(data);
    } catch(err: any) {
      const { error } = err.response.data
      console.log(error);
    }
  }

  return (
    <div>
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
          {...register('email')}
        />
        <Input
          error={errors.password}
          label="Senha"
          type="password"
          {...register('password')}
        />
        <Input
          error={errors.name}
          label="Nome"
          type="text"
          {...register('name')}
        />
        <Button>SignUp</Button>
      </form>
    </div>
  )
}