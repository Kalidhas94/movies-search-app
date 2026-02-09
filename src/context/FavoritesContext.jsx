import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('movieFavorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [ratings, setRatings] = useState(() => {
        const saved = localStorage.getItem('movieRatings');
        return saved ? JSON.parse(saved) : {}; // { [imdbID]: number }
    });

    useEffect(() => {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('movieRatings', JSON.stringify(ratings));
    }, [ratings]);

    const addFavorite = (movie) => {
        setFavorites((prev) => {
            if (prev.some(fav => fav.imdbID === movie.imdbID)) return prev;
            return [...prev, movie];
        });
    };

    const removeFavorite = (id) => {
        setFavorites((prev) => {
            const next = [];
            for (let i = 0; i < prev.length; i++) {
                const movie = prev[i];
                if (movie.imdbID !== id) next.push(movie);
            }
            return next;
        });
    };

    const isFavorite = (id) => {
        return favorites.some(movie => movie.imdbID === id);
    };

    const setRating = (id, value) => {
        setRatings((prev) => {
            const next = { ...prev };
            if (value == null) {
                delete next[id];
            } else {
                next[id] = value;
            }
            return next;
        });
    };

    const getRating = (id) => {
        return ratings[id] ?? null;
    };

    const removeRating = (id) => {
        setRating(id, null);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            ratings,
            setRating,
            getRating,
            removeRating,
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
