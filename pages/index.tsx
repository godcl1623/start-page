import Search from 'components/search';

export default function Index() {
  return (
    <article className='flex-center w-full h-full bg-neutral-100 dark:bg-neutral-800 dark:text-white'>
      <section className='flex-center w-1/2 h-full'>
        <Search />
      </section>
    </article>
  );
}
