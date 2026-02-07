import MovieCard from '../components/MovieCard';
import { useFavorites } from '../context/FavoritesContext';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { favorites } = useFavorites();

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <Heart className="w-8 h-8 text-accent fill-current" />
                    <h1 className="text-4xl font-bold text-white">My Favorites</h1>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-gray-300">
                        {favorites.length}
                    </span>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-fade-in">
                        <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
                        <p className="text-gray-400 max-w-md mx-auto mb-8">
                            You haven't added any movies to your favorites list yet. Search for movies and click the heart icon to save them here.
                        </p>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-accent hover:bg-red-700 rounded-xl font-bold transition-colors inline-block"
                        >
                            Start Exploring
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
