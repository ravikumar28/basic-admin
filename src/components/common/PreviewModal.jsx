import React from 'react';
import Modal from './Modal';

const PreviewModal = ({ isOpen, onClose, htmlContent }) => {
  const openInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="h-[80vh] w-full">
        <div className="flex justify-end mb-2">
          <button
            onClick={openInNewTab}
            className="text-sm text-blue-600 hover:underline"
          >
            Open in new tab
          </button>
        </div>
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border rounded"
          title="Report Preview"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </Modal>
  );
};

export default PreviewModal;