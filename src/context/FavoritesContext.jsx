import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('movieFavorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    }, [favorites]);

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

    return (
        <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
