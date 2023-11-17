import { useMemo, useState } from 'react';
import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { BiTrash, BiPencil, BiExpand, BiBot } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import Modal from './Modal/Modal';
import ModalContent from './Modal/ModalContent';
import Title from './Title';

export default function Note({
  noteId,
  code,
  title,
}: {
  noteId: string;
  code: string;
  title: string;
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const copyBlockProps = {
    text: code,
    language: 'javascript',
    showLineNumbers: true,
    theme: atomOneLight,
  };

  const iconSize = useMemo(() => ({ size: '1.3em' }), []);

  const handleButtonClick = (operation: string) => {
    setModalIsOpen(true);
    setModalType(operation);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setModalType('');
  };

  return (
    <>
      <div className="my-5 bg-zinc-700 rounded-md w-[800px] h-[300px]">
        <div className="h-[40px] flex justify-between items-center text-zinc-50">
          <Title title={title} />
          <div className="px-3 flex justify-around w-[150px]">
            <button
              className=""
              title="note analysis"
              onClick={() => handleButtonClick('analysis')}
            >
              <IconContext.Provider value={iconSize}>
                <BiBot />
              </IconContext.Provider>
            </button>
            <button className="" title="expand note">
              <IconContext.Provider value={iconSize}>
                <BiExpand />
              </IconContext.Provider>
            </button>
            <button className="" title="edit note">
              <IconContext.Provider value={iconSize}>
                <BiPencil />
              </IconContext.Provider>
            </button>
            <button
              className=""
              title="delete note"
              onClick={() => handleButtonClick('delete')}
            >
              <IconContext.Provider value={iconSize}>
                <BiTrash />
              </IconContext.Provider>
            </button>
          </div>
        </div>
        <div className="h-[260px] p-2 overflow-auto overscroll-none">
          <div className="min-h-full bg-zinc-50 rounded-md text-sm">
            <CopyBlock {...copyBlockProps} />
          </div>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} handleClose={handleCloseModal}>
        <ModalContent
          type={modalType}
          noteId={noteId}
          handleClose={handleCloseModal}
        />
      </Modal>
    </>
  );
}
