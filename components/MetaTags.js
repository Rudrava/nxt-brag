import Head from "next/head";
const MetaTags = ({ title, desc, image }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@rudra_m1" />
      <meta name="twitter:titke" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={desc} />
      <meta name="og:image" content={image} />
    </Head>
  );
};

export default MetaTags;
