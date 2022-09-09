import Head from 'next/head';

interface SeoInterface {
  title: string;
}

export default function Seo({ title }: SeoInterface) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}