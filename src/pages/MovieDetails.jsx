import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/omdbApi';
import { ArrowLeft, Star, Heart, Calendar, Clock, Film, Globe, Award, Users, Clapperboard, Zap } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import StarRating from '../components/StarRating';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [imageLoaded, setImageLoaded] = useState(false);

    const favorited = movie ? isFavorite(movie.imdbID) : false;

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getMovieDetails(id);
                if (data.error) {
                    setError(data.error);
                    setMovie(null);
                } else {
                    setMovie(data.data);
                }
            } catch (err) {
                setError(err.message || 'Failed to load movie details.');
                setMovie(null);
            }
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    const toggleFavorite = () => {
        if (favorited) {
            removeFavorite(movie.imdbID);
        } else {
            addFavorite(movie);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center pt-24">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4 pt-24">
            <h2 className="text-2xl font-bold text-red-500">Error Loading Details</h2>
            <p className="text-gray-400">{error}</p>
            <div className="mt-4 flex gap-3">
                <button onClick={() => navigate(-1)} className="px-6 py-2 bg-white/10 text-white rounded-lg">Go Back</button>
                <button onClick={() => {
                    // retry fetch
                    setLoading(true);
                    setError(null);
                    (async () => {
                        const data = await getMovieDetails(id);
                        if (data.error) {
                            setError(data.error);
                            setMovie(null);
                        } else {
                            setMovie(data.data);
                        }
                        setLoading(false);
                    })();
                }} className="px-6 py-2 bg-accent text-white rounded-lg">Retry</button>
            </div>
        </div>
    );

    if (!movie) return null;

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    const rating = movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null;
    const imdbAverageOutOf5 = rating ? Math.round((rating / 2) * 10) / 10 : null; // scaled to 5
    const actors = movie.Actors && movie.Actors !== 'N/A' ? movie.Actors.split(', ') : [];
    const genres = movie.Genre && movie.Genre !== 'N/A' ? movie.Genre.split(', ') : [];

    return (
        <div className="min-h-screen relative pt-24 pb-12 bg-gradient-to-b from-primary to-primary/80">
            {/* Background Backdrop */}
            <div className="absolute inset-0 z-0">
                <img
                    src={posterUrl}
                    alt="backdrop"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover opacity-10 blur-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Search
                </button>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 lg:gap-12 animate-slide-up">
                    {/* Poster Section */}
                    <div className="space-y-6">
                        {/* Poster Image */}
                        <div className="rounded-2xl overflow-hidden glass shadow-2xl shadow-black/50 aspect-[2/3] group relative bg-secondary">
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 animate-pulse z-0"></div>
                            )}
                            <img
                                src={posterUrl}
                                alt={movie.Title}
                                onLoad={() => setImageLoaded(true)}
                                crossOrigin="anonymous"
                                loading="eager"
                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 relative z-10 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        </div>

                        {/* Rating Badge */}
                        {rating && (
                            <div className="glass rounded-xl p-4 text-center space-y-2">
                                <div className="flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">{rating.toFixed(1)}</div>
                                            <div className="text-xs text-yellow-100">/10</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">IMDb Rating</p>
                            </div>
                        )}

                        {/* User Rating (1-5 stars) */}
                        <div className="glass rounded-xl p-4 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-300">Your Rating</h4>
                            <div className="flex items-center justify-center">
                                <StarRating movieId={movie.imdbID} size={6} />
                            </div>
                            {imdbAverageOutOf5 && (
                                <p className="text-xs text-gray-400 text-center">Average (IMDb scaled): {imdbAverageOutOf5} / 5</p>
                            )}
                        </div>

                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                                favorited
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                            {favorited ? 'Favorited' : 'Add to Favorites'}
                        </button>

                        {/* Quick Info */}
                        <div className="glass rounded-xl p-4 space-y-3 text-sm">
                            {movie.Year && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span className="text-gray-300">{movie.Year}</span>
                                </div>
                            )}
                            {movie.Runtime && movie.Runtime !== 'N/A' && (
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="text-gray-300">{movie.Runtime}</span>
                                </div>
                            )}
                            {movie.Type && (
                                <div className="flex items-center gap-3">
                                    <Clapperboard className="w-4 h-4 text-accent" />
                                    <span className="text-gray-300 capitalize">{movie.Type}</span>
                                </div>
                            )}
                            {movie.Rated && movie.Rated !== 'N/A' && (
                                <div className="flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-accent" />
                                    <span className="text-gray-300">{movie.Rated}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        {/* Title & Basic Info */}
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white">{movie.Title}</h1>
                            
                            {/* Genres */}
                            {genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {genres.map((genre, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium border border-accent/50 hover:bg-accent/30 transition-colors"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-4 border-b border-white/10">
                            {['overview', 'cast', 'ratings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 font-semibold transition-all border-b-2 ${
                                        activeTab === tab
                                            ? 'border-accent text-white'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Plot */}
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-white mb-3">
                                            <Film className="w-5 h-5 text-accent" /> Plot Summary
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                                    </div>

                                    {/* Production Details */}
                                    <div className="glass rounded-xl p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-white">Production Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-gray-500 text-sm mb-1">Director</p>
                                                <p className="text-white">{movie.Director !== 'N/A' ? movie.Director : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm mb-1">Writer(s)</p>
                                                <p className="text-white">{movie.Writer !== 'N/A' ? movie.Writer : 'N/A'}</p>
                                            </div>
                                            {movie.Country && movie.Country !== 'N/A' && (
                                                <div>
                                                    <p className="text-gray-500 text-sm mb-1 flex items-center gap-1">
                                                        <Globe className="w-4 h-4" /> Country
                                                    </p>
                                                    <p className="text-white">{movie.Country}</p>
                                                </div>
                                            )}
                                            {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                                                <div>
                                                    <p className="text-gray-500 text-sm mb-1">Box Office</p>
                                                    <p className="text-white">{movie.BoxOffice}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Awards */}
                                    {movie.Awards && movie.Awards !== 'N/A' && (
                                        <div className="glass rounded-xl p-6 space-y-3">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                                <Award className="w-5 h-5 text-accent" /> Awards
                                            </h3>
                                            <p className="text-gray-300">{movie.Awards}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cast Tab */}
                            {activeTab === 'cast' && (
                                <div className="space-y-6">
                                    {actors.length > 0 && (
                                        <div className="glass rounded-xl p-6 space-y-4">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                                <Users className="w-5 h-5 text-accent" /> Cast
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {actors.map((actor, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-black/30 rounded-lg p-4 hover:bg-black/50 transition-colors"
                                                    >
                                                        <p className="text-white font-medium">{actor.trim()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(!actors || actors.length === 0) && (
                                        <p className="text-gray-400 text-center py-8">No cast information available</p>
                                    )}
                                </div>
                            )}

                            {/* Ratings Tab */}
                            {activeTab === 'ratings' && (
                                <div className="space-y-6">
                                    {movie.Ratings && movie.Ratings.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {movie.Ratings.map((ratingObj, idx) => (
                                                <div
                                                    key={idx}
                                                    className="glass rounded-xl p-6 text-center space-y-2 hover:glass-darker transition-all"
                                                >
                                                    <p className="text-3xl font-bold text-accent">{ratingObj.Value}</p>
                                                    <p className="text-sm text-gray-400">{ratingObj.Source}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>No rating information available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
