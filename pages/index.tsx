import Search from 'components/search/Search';

export default function Index() {
  return (
    <article className='flex-center w-full h-full bg-neutral-100'>
      <section className='flex-center w-1/2 h-full'>
        <Search />
      </section>
    </article>
  );
}
