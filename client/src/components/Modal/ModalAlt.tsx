import React, { useLayoutEffect, useRef } from 'react';

function Modal({
  children,
  handleClose,
}: {
  children: React.ReactNode;
  handleClose: () => void;
}) {
  const nodeRef = useRef(null);

  useLayoutEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      e.key === 'Escape' ? handleClose() : null;
    };

    document.body.addEventListener('keydown', closeOnEscapeKey);

    // Disable scrolling behind modal
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
      // Re-enable scrolling
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      ref={nodeRef}
    >
      <div className="absolute inset-0 bg-zinc-800 bg-opacity-80"></div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default Modal;
