import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Solução do Teste da HubLocal" />
      </Head>
      <form>
        <h2>SignIn</h2>
        <div>
          <label>Email</label>
          <input type="email" name="email" id="email" placeholder='seu@email.com' />
        </div>
        <div>
          <label>Senha</label>
          <input type="password" name="password" id="password" />

        </div>
      </form>
    </div>
  )
}

export default Home
