import Image from 'next/image';

export default function Home() {
  //console.log("test");

  const renderName = () => {
    const name = 'Ali';
    return <span>{name}</span>;
  };
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div> mu first page</div>
      {renderName()}
    </div>
  );
}
