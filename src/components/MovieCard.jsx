import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Calendar } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const MovieCard = ({ movie, viewMode = 'grid' }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isFavorite, addFavorite, removeFavorite, getRating } = useFavorites();
    const favorited = isFavorite(movie.imdbID);
    const userRating = getRating(movie.imdbID);

    const toggleFavorite = (e) => {
        e.preventDefault(); // Prevent navigation
        if (favorited) {
            removeFavorite(movie.imdbID);
        } else {
            addFavorite(movie);
        }
    };

    const posterUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    const rating = movie.Rating && movie.Rating !== 'N/A' ? parseFloat(movie.Rating) : null;
    const plotText = movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No description available';

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    if (viewMode === 'list') {
        return (
            <Link to={`/movie/${movie.imdbID}`} className="flex gap-4 p-4 rounded-xl glass hover:glass-darker transition-all duration-300 group">
                {/* Poster */}
                <div className="relative flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden bg-secondary">
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                    )}
                    <img
                        src={posterUrl}
                        alt={movie.Title}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        loading="lazy"
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                    <div className="absolute top-1 left-1 z-10">
                        <span className="capitalize px-2 py-0.5 rounded text-white text-xs font-medium bg-accent/80">
                            {movie.Type}
                        </span>
                    </div>
                    {rating && (
                        <div className="absolute bottom-1 left-1 flex items-center gap-1 px-2 py-1 bg-yellow-500/80 rounded text-white text-xs font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {rating.toFixed(1)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                            {movie.Title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>{movie.Year}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">
                            {plotText}
                        </p>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        className={`self-start mt-2 p-2 rounded-lg transition-all duration-200 ${
                            favorited
                                ? 'bg-accent text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-accent/20 hover:text-accent'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </Link>
        );
    }

    // Grid view (default)
    return (
        <Link to={`/movie/${movie.imdbID}`} className="block group relative rounded-xl overflow-hidden glass-card h-[450px] animate-fade-in hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300">
            {/* Poster Image Container */}
            <div className="relative w-full h-full bg-secondary overflow-hidden">
                {/* Loading skeleton */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                )}
                
                {/* Image */}
                <img
                    src={posterUrl}
                    alt={movie.Title}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    crossOrigin="anonymous"
                    loading="lazy"
                    className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                />
            </div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2 z-10">
                <span className="capitalize px-2 py-1 rounded bg-black/60 text-white text-xs font-bold">
                    {movie.Type}
                </span>
            </div>

            {/* Favorite Button */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
                        favorited ? 'bg-accent text-white' : 'bg-black/60 text-white hover:bg-accent'
                    }`}
                >
                    <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Rating Badge */}
            {rating && (
                <div className="absolute bottom-20 left-2 z-10 flex items-center gap-1 px-3 py-1 bg-yellow-500/90 rounded-lg text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Star className="w-4 h-4 fill-current" />
                    {rating.toFixed(1)}
                </div>
            )}

            {/* User Rating (1-5) */}
            {userRating && (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 rounded text-yellow-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < userRating ? 'fill-current' : ''}`} />
                    ))}
                    <span className="ml-2 text-white text-xs">{userRating}/5</span>
                </div>
            )}

            {/* Overlay with Info - Shows on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 space-y-3">
                {/* Title */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{movie.Title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.Year}</span>
                    </div>
                </div>

                {/* Description */}
                {plotText && plotText !== 'No description available' && (
                    <p className="text-sm text-gray-200 line-clamp-3">
                        {plotText}
                    </p>
                )}

                {/* View Details Link */}
                <div className="pt-2">
                    <span className="text-accent text-sm font-semibold hover:underline">View Details →</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
