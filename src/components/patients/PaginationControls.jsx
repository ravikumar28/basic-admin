import React from 'react';

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const pages = [];
  
  // Build pagination array
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || 
      i === totalPages || 
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      i === currentPage - 2 || 
      i === currentPage + 2
    ) {
      pages.push('...');
    }
  }
  
  // Remove duplicates from pagination array
  const filteredPages = pages.filter((page, index, self) => 
    page === '...' ? page !== self[index - 1] : true
  );

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          Previous
        </button>
        
        {filteredPages.map((page, index) => (
          <button
            key={`${page}-${index}`}
            onClick={() => page !== '...' && onPageChange(page)}
            disabled={page === '...'}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              page === currentPage
                ? 'bg-primary-500 text-white'
                : page === '...'
                ? 'bg-white text-gray-500 cursor-default'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;