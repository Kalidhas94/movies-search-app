import React from 'react';
import { Star } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

const StarRating = ({ movieId, size = 6, max = 5, onChange }) => {
    const { getRating, setRating } = useFavorites();
    const userRating = getRating(movieId);

    const handleSet = (value, e) => {
        e && e.preventDefault();
        setRating(movieId, value);
        if (onChange) onChange(value);
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }).map((_, i) => {
                const val = i + 1;
                const filled = userRating ? val <= userRating : false;
                return (
                    <button
                        key={val}
                        onClick={(e) => handleSet(val, e)}
                        onDoubleClick={(e) => handleSet(null, e)}
                        className={`p-1 rounded transition-colors ${filled ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`}
                        title={userRating ? `${userRating} / ${max}` : `Rate ${val} / ${max}`}
                    >
                        <Star style={{ width: size * 4, height: size * 4 }} />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
