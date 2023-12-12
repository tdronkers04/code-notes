import * as React from 'react';

export const useClickAway = (callback): React.RefObject<HTMLDivElement> => {
  const ref = React.useRef<HTMLDivElement>(null);

  const onEventHandler = (e: MouseEvent) => {
    console.log('event target:', e.target);
    if (
      ref.current &&
      !(ref.current as HTMLDivElement).contains(e.target as Node)
    ) {
      callback();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', onEventHandler);

    return () => {
      document.removeEventListener('mousedown', onEventHandler);
    };
  }, []);

  return ref;
};
