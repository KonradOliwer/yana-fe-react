import React from 'react';

export function SelectOrCreateNoteBox({
  selectOrCreate: createOrOpenNote,
}: {
  selectOrCreate: (name: string, content: string | undefined) => void;
}) {
  function addOrOpenNoteClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let name = formData.get('name') as string;
    createOrOpenNote(name, undefined);
  }

  return (
    <form
      aria-label={'select note or add new'}
      className="display: flex align-items: center"
      onSubmit={addOrOpenNoteClick}
    >
      <button
        name="add-or-open-note"
        aria-label={'select note or add new'}
        className="hover:bg-gray-100 dark:hover:bg-gray-700 group mt-3 m-2"
        type="submit"
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 19V6c0-.6.4-1 1-1h4c.3 0 .6.1.8.4l1.9 2.2c.2.3.5.4.8.4H16c.6 0 1 .4 1 1v1M3 19l3-8h15l-3 8H3Z"
          />
        </svg>
      </button>
      <input
        aria-label="add or select note"
        type="text"
        name="name"
        className={`w-auto ml-0 m-4 text-black`}
        placeholder="Unnamed"
      />
    </form>
  );
}
