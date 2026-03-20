// 13.10 - 13.39

import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";

function Pagination({
  currentPage,
  OnPageChange,
  activeClass = "active",
  nextPageText = "Next",
  prevPageText = "Prev",
  firstPageText = "First",
  lastPageText = "Last",
}) {
  const { totalPages, products } = useSelector((state) => state.product);
  if (products.length === 0 || totalPages <= 1) return null; // Don't show pagination if there are no products

  // generate page numbers

  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2; // Number of pages to show on either side of the current page

    const startPage = Math.max(1, currentPage - pageWindow);
    const endPage = Math.min(totalPages, currentPage + pageWindow);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  return (
    <div>
      <div className="pagination">
        {currentPage > 1 && (
          <button className="pagination-btn" onClick={() => OnPageChange(1)}>
            {firstPageText}
          </button>
        )}

        {currentPage > 1 && (
          <button
            className="pagination-btn"
            onClick={() => OnPageChange(currentPage - 1)}
          >
            {prevPageText}
          </button>
        )}

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? activeClass : ""}`}
            onClick={() => OnPageChange(page)}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            className="pagination-btn"
            onClick={() => OnPageChange(currentPage + 1)}
          >
            {nextPageText}
          </button>
        )}

        {currentPage < totalPages && (
          <button
            className="pagination-btn"
            onClick={() => OnPageChange(totalPages)}
          >
            {lastPageText}
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
