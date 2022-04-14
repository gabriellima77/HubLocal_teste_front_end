import type { NextPage } from 'next';

import Head from 'next/head';
import { Input } from '../components/Input';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../components/Button';
import { useRef } from 'react';

interface IFormData {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
  password: yup.string().required('Senha obrigatória!'),
});

const Home: NextPage = () => { 
  const ref = useRef();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  const onSubmit: SubmitHandler<IFormData> = (data) => console.log(data);

  return (
    <div>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Solução do Teste da HubLocal" />
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>SignIn</h2>
        <Input
          error={errors.email}
          label="E-mail"
          type="email"
          {...register('email')}
        />
        <Input
          error={errors.password}
          label="Senha"
          type="password"
          {...register('password')}
        />
        <Button>SignIn</Button>
      </form>
    </div>
  )
}

export default Home
