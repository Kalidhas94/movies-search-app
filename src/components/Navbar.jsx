import { Link, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <Film className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Discovery Movies
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className={`text-sm font-medium hover:text-accent transition-colors ${location.pathname === '/' ? 'text-accent' : 'text-gray-300'
                            }`}
                    >
                        Search
                    </Link>
                    <Link
                        to="/favorites"
                        className={`text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 ${location.pathname === '/favorites' ? 'text-accent' : 'text-gray-300'
                            }`}
                    >
                        <Heart className="w-4 h-4" />
                        Favorites
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
