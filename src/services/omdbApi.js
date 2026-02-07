const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = `https://www.omdbapi.com/`;

// Cache for API responses to reduce redundant calls
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache duration

// Validate API key on module load
const validateApiKey = () => {
    if (!API_KEY) {
        console.error('OMDB API Key is not configured. Please add VITE_OMDB_API_KEY to your .env file');
        return false;
    }
    return true;
};

// Validate response structure
const validateResponse = (data) => {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid response from API' };
    }
    return { valid: true };
};

// Check if cached data is still valid
const getCachedData = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`Cache hit for: ${key}`);
        return cached.data;
    }
    // Clear expired cache
    if (cached) {
        cache.delete(key);
    }
    return null;
};

// Store data in cache
const setCachedData = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

// Retry logic for failed requests
const fetchWithRetry = async (url, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return response;
            }
            // If rate limited, wait before retrying
            if (response.status === 429 && i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                continue;
            }
            return response;
        } catch (err) {
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                continue;
            }
            throw err;
        }
    }
};

// Normalize movie data for consistency
const normalizeMovieData = (movie) => {
    if (!movie) return null;
    
    // Log movie data for debugging
    console.log('Normalizing movie:', movie.Title, 'Poster:', movie.Poster);
    
    return {
        ...movie,
        Title: movie.Title || 'N/A',
        Year: movie.Year || 'N/A',
        Poster: movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null,
        Type: movie.Type || 'N/A',
        imdbID: movie.imdbID || 'N/A',
        Runtime: movie.Runtime || 'N/A',
        Genre: movie.Genre || 'N/A',
        Director: movie.Director || 'N/A',
        Actors: movie.Actors || 'N/A',
        Plot: movie.Plot || 'N/A',
        Rating: movie.imdbRating || 'N/A',
        Votes: movie.imdbVotes || 'N/A'
    };
};

export const searchMovies = async (query, type = '', page = 1) => {
    try {
        // Validate inputs
        if (!query || query.trim() === '') {
            return {
                results: [],
                totalResults: 0,
                error: 'Please enter a search query'
            };
        }

        if (!validateApiKey()) {
            return {
                results: [],
                totalResults: 0,
                error: 'API configuration error. Please check your environment variables.'
            };
        }

        // Create cache key from query parameters
        const cacheKey = `search_${query}_${type}_${page}`;
        
        // Check cache first
        const cachedResult = getCachedData(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}&page=${page}`;
        const response = await fetchWithRetry(url);

        if (!response.ok) {
            let message = `HTTP Error: ${response.status}`;
            if (response.status === 401) message = 'Invalid API key. Please check your VITE_OMDB_API_KEY.';
            else if (response.status === 403) message = 'Access denied. The API key may not have required permissions.';
            else if (response.status === 429) message = 'Rate limit exceeded. Please wait a moment and try again.';
            else if (response.status >= 500) message = 'Server error from OMDB. Please try again later.';

            const errorResult = {
                results: [],
                totalResults: 0,
                error: message
            };
            return errorResult;
        }

        const data = await response.json();
        const validation = validateResponse(data);

        if (!validation.valid) {
            const errorResult = {
                results: [],
                totalResults: 0,
                error: validation.error
            };
            return errorResult;
        }

        if (data.Response === 'True') {
            const result = {
                results: (data.Search || []).map(normalizeMovieData),
                totalResults: parseInt(data.totalResults, 10) || 0,
                error: null
            };
            // Cache successful results
            setCachedData(cacheKey, result);
            return result;
        } else {
            return {
                results: [],
                totalResults: 0,
                error: data.Error || 'Unknown error occurred'
            };
        }
    } catch (err) {
        console.error('Search Movies Error:', err);
        return {
            results: [],
            totalResults: 0,
            error: err.message || 'Failed to fetch movies. Please try again.'
        };
    }
};

export const getMovieDetails = async (id) => {
    try {
        // Validate input
        if (!id || id.trim() === '') {
            return {
                data: null,
                error: 'Invalid movie ID'
            };
        }

        if (!validateApiKey()) {
            return {
                data: null,
                error: 'API configuration error. Please check your environment variables.'
            };
        }

        // Create cache key from movie ID
        const cacheKey = `details_${id}`;
        
        // Check cache first
        const cachedResult = getCachedData(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const url = `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`;
        const response = await fetchWithRetry(url);

        if (!response.ok) {
            let message = `HTTP Error: ${response.status}`;
            if (response.status === 401) message = 'Invalid API key. Please check your VITE_OMDB_API_KEY.';
            else if (response.status === 403) message = 'Access denied. The API key may not have required permissions.';
            else if (response.status === 429) message = 'Rate limit exceeded. Please wait a moment and try again.';
            else if (response.status >= 500) message = 'Server error from OMDB. Please try again later.';

            const errorResult = {
                data: null,
                error: message
            };
            return errorResult;
        }

        const data = await response.json();
        const validation = validateResponse(data);

        if (!validation.valid) {
            const errorResult = {
                data: null,
                error: validation.error
            };
            return errorResult;
        }

        if (data.Response === 'True') {
            const result = {
                data: normalizeMovieData(data),
                error: null
            };
            // Cache successful results
            setCachedData(cacheKey, result);
            return result;
        } else {
            return {
                data: null,
                error: data.Error || 'Movie not found'
            };
        }
    } catch (err) {
        console.error('Get Movie Details Error:', err);
        return {
            data: null,
            error: err.message || 'Failed to fetch movie details. Please try again.'
        };
    }
};

/**
 * Get multiple movies by their IMDb IDs
 * @param {string[]} ids - Array of IMDb IDs
 * @returns {Promise<{movies: object[], errors: object[]}>}
 */
export const getMoviesByIds = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        return {
            movies: [],
            errors: []
        };
    }

    const results = await Promise.all(
        ids.map(id => getMovieDetails(id))
    );

    // Build movies and errors arrays without using .filter
    const moviesArr = [];
    const errorsArr = [];
    for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r && !r.error) {
            moviesArr.push(r.data);
        } else if (r && r.error) {
            errorsArr.push(r.error);
        }
    }

    return {
        movies: moviesArr,
        errors: errorsArr
    };
};

/**
 * Get trending/popular movies by searching common titles
 * @returns {Promise<object>} Returns structured search results
 */
export const getTrendingMovies = async () => {
    const trendingSearches = ['Avatar', 'Inception', 'Interstellar'];
    
    try {
        const results = await Promise.all(
            trendingSearches.map(title => searchMovies(title, 'movie', 1))
        );
        
        const allMovies = results.flatMap(r => r.results).slice(0, 12);
        
        return {
            results: allMovies,
            totalResults: allMovies.length,
            error: null
        };
    } catch (err) {
        console.error('Get Trending Movies Error:', err);
        return {
            results: [],
            totalResults: 0,
            error: 'Failed to fetch trending movies'
        };
    }
};

/**
 * Clear the API response cache
 */
export const clearCache = () => {
    cache.clear();
    console.log('API cache cleared');
};

/**
 * Get cache statistics
 * @returns {object} Cache size and entries
 */
export const getCacheStats = () => {
    return {
        size: cache.size,
        entries: Array.from(cache.keys())
    };
};
