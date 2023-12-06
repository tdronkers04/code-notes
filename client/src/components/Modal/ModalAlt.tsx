import React, { useEffect, useRef } from 'react';

function Modal({
  children,
  handleClose,
}: {
  children: React.ReactNode;
  handleClose: () => void;
}) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      ref={nodeRef}
    >
      <div className="absolute inset-0 bg-zinc-900 bg-opacity-80"></div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Modal;
