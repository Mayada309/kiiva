import React from 'react';

function SideHeading({ title }: { title: string }) {
  return (
    <div>
      <h1 className='text-4xl text-slate-700 hover:text-slate-500 transition duration-100 capitalize border-b text-right  border-slate-400 w-fit py-4 font-extrabold mb-4'>
        {title}
      </h1>
    </div>
  );
}

export default SideHeading;
