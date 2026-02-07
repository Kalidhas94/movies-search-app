import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Pagination = ({ currentPage, totalResults, onPageChange, resultsPerPage = 10 }) => {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const [jumpPage, setJumpPage] = useState(currentPage);

    // Update jumpPage when currentPage changes
    useEffect(() => {
        setJumpPage(currentPage);
    }, [currentPage]);

    if (totalPages <= 1) return null;

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(jumpPage, 10);
        if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum);
            // Scroll to top of results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPageButtons = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // First page button
        if (startPage > 1) {
            pages.push(
                <button
                    key="page-1"
                    onClick={() => {
                        onPageChange(1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    title="Go to first page"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="dots-start" className="px-2 text-gray-400">
                        ...
                    </span>
                );
            }
        }

        // Page number buttons
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={`page-${i}`}
                    onClick={() => {
                        onPageChange(i);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                        i === currentPage
                            ? 'bg-accent text-white shadow-lg shadow-accent/20 font-bold'
                            : 'text-white hover:bg-white/10'
                    }`}
                    aria-current={i === currentPage ? 'page' : undefined}
                    aria-label={`Go to page ${i}`}
                >
                    {i}
                </button>
            );
        }

        // Last page button
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="dots-end" className="px-2 text-gray-400">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={`page-${totalPages}`}
                    onClick={() => {
                        onPageChange(totalPages);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                    title="Go to last page"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    const startResult = (currentPage - 1) * resultsPerPage + 1;
    const endResult = Math.min(currentPage * resultsPerPage, totalResults);

    return (
        <div className="mt-10 space-y-6">
            {/* Pagination Controls */}
            <div className="glass rounded-xl p-6 space-y-4">
                {/* Results Info */}
                <div className="text-sm text-gray-300 text-center">
                    Showing <span className="font-semibold text-white">{startResult}</span> to{' '}
                    <span className="font-semibold text-white">{endResult}</span> of{' '}
                    <span className="font-semibold text-accent">{totalResults}</span> results
                </div>

                {/* Top Navigation */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* First Page Button */}
                    <button
                        onClick={() => {
                            onPageChange(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        aria-label="First page"
                        title="First Page"
                    >
                        <ChevronsLeft className="w-5 h-5" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={() => {
                            onPageChange(currentPage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        aria-label="Previous page"
                        title="Previous Page"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1 flex-wrap justify-center">
                        {renderPageButtons()}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => {
                            onPageChange(currentPage + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        aria-label="Next page"
                        title="Next Page"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Last Page Button */}
                    <button
                        onClick={() => {
                            onPageChange(totalPages);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg glass disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        aria-label="Last page"
                        title="Last Page"
                    >
                        <ChevronsRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Jump to Page */}
                <form onSubmit={handleJumpToPage} className="flex gap-2 justify-center">
                    <label htmlFor="jump-page" className="text-sm text-gray-400 flex items-center">
                        Jump to page:
                    </label>
                    <input
                        id="jump-page"
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        className="w-16 px-2 py-1 rounded-lg bg-white/10 text-white border border-white/20 focus:border-accent focus:outline-none transition-colors text-center"
                        aria-label="Jump to page"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1 rounded-lg bg-accent hover:bg-red-700 text-white transition-colors text-sm font-medium"
                        aria-label="Go to page"
                    >
                        Go
                    </button>
                </form>

                {/* Page Info */}
                <div className="text-center text-sm text-gray-400 border-t border-white/10 pt-4">
                    Page <span className="font-semibold text-white">{currentPage}</span> of{' '}
                    <span className="font-semibold text-white">{totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
