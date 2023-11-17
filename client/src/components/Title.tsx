import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL;

function Title({ title }: { title: string }) {
  // const { getToken } = useAuth();
  const [editState, setEditState] = useState(false);

  const handleOnBlur = () => {
    setEditState(false);
  };

  if (editState) {
    return (
      <input
        className="ml-3 px-1 text-black"
        type="text"
        placeholder={title}
        onBlur={handleOnBlur}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    );
  }

  return (
    <div
      className="px-3"
      onClick={() => setEditState(true)}
      onKeyUp={() => setEditState(true)}
      role="button"
      tabIndex={0}
    >
      {title}
    </div>
  );
}

export default Title;
