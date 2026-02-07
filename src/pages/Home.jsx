import { useState, useEffect } from 'react';
import { searchMovies, clearCache, getTrendingMovies } from '../services/omdbApi';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SearchFilter from '../components/SearchFilter';
import { LayoutGrid, List } from 'lucide-react';

const Home = () => {
    const [query, setQuery] = useState('Avatar'); // Default search to show something initially
    const [searchInput, setSearchInput] = useState('Avatar');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        const data = await searchMovies(query, type, page);

        if (data.error) {
            setError(data.error);
            setMovies([]);
        } else {
            console.log('Movies fetched:', data.results);
            setMovies(data.results || []);
            setTotalResults(data.totalResults);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMovies();
    }, [query, type, page]);

    const handleSearch = () => {
        if (searchInput.trim()) {
            setPage(1); // Reset to page 1 on new search
            setQuery(searchInput);
        }
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Search */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent animate-slide-up">
                        Discovery Cinema
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Search for movies, series, and episodes.
                    </p>

                    <SearchFilter
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        type={type}
                        onTypeChange={handleTypeChange}
                        onSearch={handleSearch}
                        isLoading={loading}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 glass rounded-2xl">
                        <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
                        <p className="text-gray-400">{error}</p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <button onClick={fetchMovies} className="px-4 py-2 bg-accent text-white rounded-lg">Retry</button>
                            <button onClick={() => { clearCache(); fetchMovies(); }} className="px-4 py-2 bg-white/10 text-white rounded-lg">Clear Cache & Retry</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {movies.length > 0 && (
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {totalResults > 0 ? `${totalResults} Results Found` : 'No Results'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Showing {movies.length} movies on page {page}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-lg transition-all duration-200 ${
                                            viewMode === 'grid'
                                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                        }`}
                                        aria-label="Grid view"
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-lg transition-all duration-200 ${
                                            viewMode === 'list'
                                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                        }`}
                                        aria-label="List view"
                                        title="List View"
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {movies.length > 0 ? (
                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in' : 'space-y-4 animate-fade-in'}>
                                {movies.map((movie) => (
                                    <MovieCard key={movie.imdbID} movie={movie} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-90 glass rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                <p className="text-gray-400 mb-4">We couldn't find any titles matching <span className="font-medium">"{query}"</span>.</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                        onClick={() => { setType(''); setSearchInput(''); setQuery(''); setPage(1); setMovies([]); setTotalResults(0); }}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg"
                                    >
                                        Clear Filters
                                    </button>
                                    <button
                                        onClick={fetchMovies}
                                        className="px-4 py-2 bg-accent text-white rounded-lg"
                                    >
                                        Retry
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setLoading(true);
                                            setError(null);
                                            const data = await getTrendingMovies();
                                            if (data.error) {
                                                setError(data.error);
                                                setMovies([]);
                                                setTotalResults(0);
                                            } else {
                                                setMovies(data.results || []);
                                                setTotalResults(data.totalResults || (data.results || []).length);
                                                setQuery('');
                                                setSearchInput('');
                                                setType('');
                                            }
                                            setLoading(false);
                                        }}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg"
                                    >
                                        Show Trending
                                    </button>
                                </div>

                                <div className="mt-4 text-sm text-gray-400">
                                    <p>Tips: Try different keywords, remove the type filter, or check your network connection.</p>
                                </div>
                            </div>
                        )}

                        <Pagination
                            currentPage={page}
                            totalResults={totalResults}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
