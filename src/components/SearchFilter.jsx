import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';

const SearchFilter = ({
    searchInput,
    setSearchInput,
    type,
    onTypeChange,
    onSearch,
    isLoading = false
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const suggestionsRef = useRef(null);

    // Common search suggestions
    const suggestions = [
        'Avatar',
        'Inception',
        'Interstellar',
        'The Matrix',
        'Titanic',
        'Avengers',
        'Spider-Man',
        'Batman',
        'Joker',
        'Forrest Gump',
        'The Shawshank Redemption',
        'Breaking Bad'
    ];

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        const stored = localStorage.getItem('recentMovieSearches');
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (err) {
                console.error('Failed to load recent searches:', err);
            }
        }
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e, query = searchInput) => {
        e.preventDefault();
        if (query.trim()) {
            // Add to recent searches (remove duplicates without using .filter)
            const filtered = [];
            for (let i = 0; i < recentSearches.length; i++) {
                if (recentSearches[i] !== query) filtered.push(recentSearches[i]);
            }
            const updated = [query, ...filtered].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentMovieSearches', JSON.stringify(updated));

            setShowSuggestions(false);
            onSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion);
        setShowSuggestions(false);
        // Trigger search with the suggestion
        setTimeout(() => {
            const form = document.querySelector('[data-search-form]');
            if (form) {
                const event = new Event('submit', { bubbles: true });
                form.dispatchEvent(event);
            }
        }, 0);
    };

    const handleClear = () => {
        setSearchInput('');
        setShowSuggestions(false);
    };

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
        // Show suggestions when input has value or is focused
        if (e.target.value.trim() || showSuggestions) {
            setShowSuggestions(true);
        }
    };

    const handleInputFocus = () => {
        setShowSuggestions(true);
    };

    return (
        <div className="space-y-4">
            <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-4 relative z-10"
                data-search-form
            >
                <div className="relative flex-1" ref={suggestionsRef}>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            placeholder="Search for movies, series, or episodes..."
                            disabled={isLoading}
                            aria-label="Search movies"
                            aria-haspopup="listbox"
                            aria-expanded={showSuggestions}
                            className="w-full pl-12 pr-10 py-4 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />

                        {/* Clear button */}
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                aria-label="Clear search"
                                disabled={isLoading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Suggestions and Recent Searches Dropdown */}
                    {showSuggestions && (
                        <div
                            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl overflow-hidden shadow-lg z-20 max-h-96 overflow-y-auto"
                            role="listbox"
                        >
                            {/* Recent Searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-black/20">
                                        <Clock className="w-3 h-3 inline mr-2" />
                                        Recent Searches
                                    </div>
                                    {recentSearches.map((search, idx) => (
                                        <button
                                            key={`recent-${idx}`}
                                            type="button"
                                            onClick={() => handleSuggestionClick(search)}
                                            className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-white flex items-center gap-2"
                                            role="option"
                                        >
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            {search}
                                        </button>
                                    ))}
                                    <div className="h-px bg-white/10"></div>
                                </div>
                            )}

                            {/* Suggestions */}
                            <div>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-black/20">
                                    <Search className="w-3 h-3 inline mr-2" />
                                    Popular Searches
                                </div>
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={`suggestion-${idx}`}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-white"
                                        role="option"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Type Filter */}
                <select
                    value={type}
                    onChange={(e) => onTypeChange && onTypeChange(e.target.value)}
                    disabled={isLoading}
                    aria-label="Filter by type"
                    className="px-6 py-4 rounded-xl glass text-white focus:outline-none focus:border-accent appearance-none cursor-pointer hover:bg-gary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22%3e%3cpolyline points=%226 9 12 15 18 9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-right pr-10 pl-6"
                >
                    <option value="">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                    <option value="episode">Episodes</option>
                </select>

                {/* Search Button */}
                <button
                    type="submit"
                    disabled={isLoading || !searchInput.trim()}
                    className="px-8 py-4 bg-accent hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-accent/20 whitespace-nowrap"
                    aria-label="Submit search"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Searching...
                        </span>
                    ) : (
                        'Search'
                    )}
                </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Quick Search:</span>
                {['Avatar', 'Inception', 'The Matrix'].map((movie) => (
                    <button
                        key={movie}
                        onClick={() => handleSuggestionClick(movie)}
                        disabled={isLoading}
                        className="px-3 py-1 text-sm bg-white/10 hover:bg-accent/20 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Quick search for ${movie}`}
                    >
                        {movie}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchFilter;
