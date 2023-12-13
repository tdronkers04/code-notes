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
    const handleEscapeKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        nodeRef.current &&
        !(nodeRef.current as Node).contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKeyPress);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKeyPress);
      document.body.style.overflow = 'visible';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-zinc-800 bg-opacity-80"></div>
      <div className="relative" ref={nodeRef}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
