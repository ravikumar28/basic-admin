import React from 'react';
import Modal from './Modal';

const PDFModal = ({ isOpen, onClose, pdfUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="h-[80vh] w-full">
        <div className="flex justify-end mb-2">
          <button 
            onClick={() => window.open(pdfUrl, '_blank')}
            className="text-sm text-blue-600 hover:underline"
          >
            Open in new tab
          </button>
        </div>
        <embed
          src={`${pdfUrl}#toolbar=0`}
          type="application/pdf"
          width="100%"
          height="100%"
          className="border rounded"
        />
      </div>
    </Modal>
  );
};

export default PDFModal;