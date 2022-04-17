import type { NextPage } from 'next';

import Head from 'next/head';
import { Input } from '../components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '../components/Button';

import styles from '../styles/common.module.scss';
import Link from 'next/link';
import { withSSRGuest } from '../utils/withSSRGuest';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface IFormData {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido!'),
  password: yup.string().required('Senha obrigatória!'),
});

const Home: NextPage = () => { 
  const { register, handleSubmit, formState: { errors } } = useForm<IFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  const { signIn } = useContext(AuthContext);

  const onSubmit: SubmitHandler<IFormData> = async ({email, password}) => {
    await signIn({ email, password });
  } 

  return (
    <div>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Solução do Teste da HubLocal" />
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
        <Button>SignIn</Button>
        <Link href="/signup">
          <a>
            Criar conta
          </a>
        </Link>
      </form>
    </div>
  )
}

export default Home

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
