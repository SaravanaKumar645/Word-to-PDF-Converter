import Main from "../Components/Main";
import Head from "next/head";
import { useMediaQuery } from "react-responsive";
export default function Home() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 770px)",
  });
  console.log(isDesktopOrLaptop);
  return (
    <>
      <Head>
        <title>Word to PDF </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Main />
    </>
  );
}
