import type { NextPage } from 'next'
import Head from 'next/head'
import styles from "./index.module.css";
import {
  Viewport
} from "../Components";


const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Chess</title>
        <link rel="icon" href="/icon.png" />
      </Head>

      <main className={styles.main}>
        <Viewport />
      </main>
    </div>
  )
}

export default Home
