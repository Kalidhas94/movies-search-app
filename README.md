# Descovery Movies - Movie Search Application

MovieVault is a modern, responsive movie search application built with React and Tailwind CSS. It allows users to discover movies, view detailed information, and manage their favorite list with advanced features like caching, lazy loading, and smooth animations.

##  Features

- **Search Movies**: Search for movies, series, and episodes using keywords with suggestions.
- **Filter by Type**: Filter search results by Movies, Series, or Episodes.
- **Detailed View**: View comprehensive details including plot, cast, ratings, box office, and awards.
- **Favorites Management**: Save your favorite movies to a persistent list (stored in local storage).
- **Responsive Design**: Fully responsive interface with a premium dark-themed aesthetic.
- **Pagination**: Navigate through large sets of search results with smooth transitions.
- **View Modes**: Switch between Grid and List views for different browsing experiences.
- **Advanced Image Loading**: Smart image loading with skeletons, fallbacks, and CORS handling.
- **Caching**: Intelligent API response caching to reduce redundant requests.
- **Recent Searches**: Automatically tracks and displays recent search queries.

##  Tech Stack

- **React 18**: UI Library with Hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router v6**: Client-side routing
- **OMDB API**: Comprehensive movie data source
- **Lucide React**: Beautiful icon library
- **Context API**: State management for favorites

##  Project Structure

```
src/
 components/
    MovieCard.jsx       # Movie display card (grid & list views)
    Navbar.jsx          # Top navigation bar
   ````markdown
   # Descovery Movies - Movie Search Application

   MovieVault is a modern, responsive movie search application built with React and Tailwind CSS. It allows users to discover movies, view detailed information, manage favorites, and rate movies with a persistent, local rating system.

   ##  Features

   - **Search Movies**: Search for movies, series, and episodes using keywords with suggestions.
   - **Filter by Type**: Filter search results by Movies, Series, or Episodes.
   - **Detailed View**: View comprehensive details including plot, cast, ratings, box office, and awards.
   - **Favorites Management**: Save your favorite movies to a persistent list (stored in local storage).
   - **User Ratings**: Rate movies from 1–5 stars (persisted in `localStorage`).
   - **Responsive Design**: Fully responsive interface with a premium dark-themed aesthetic.
   - **Pagination**: Navigate through large sets of search results with smooth transitions.
   - **View Modes**: Switch between Grid and List views for different browsing experiences.
   - **Advanced Image Loading**: Smart image loading with skeletons, fallbacks, and CORS handling.
   - **Caching**: Intelligent API response caching to reduce redundant requests.
   - **Recent Searches**: Automatically tracks and displays recent search queries.

   ##  Tech Stack

   - **React 18**: UI Library with Hooks
   - **Vite**: Fast build tool and dev server
   - **Tailwind CSS**: Utility-first CSS framework for styling
   - **React Router v6**: Client-side routing
   - **OMDB API**: Comprehensive movie data source
   - **Lucide React**: Beautiful icon library
   - **Context API**: State management for favorites and ratings

   ##  Project Structure

   ```
   src/
    components/
       MovieCard.jsx       # Movie display card (grid & list views)
       Navbar.jsx          # Top navigation bar
       Pagination.jsx      # Pagination controls
       SearchFilter.jsx    # Search and filter interface
       StarRating.jsx      # Interactive star rating component
    pages/
       Home.jsx            # Main search page
       MovieDetails.jsx    # Detailed movie info page
       Favorites.jsx       # Saved favorites page
    services/
       omdbApi.js          # API integration with caching & retry logic
    context/
       FavoritesContext.jsx # Favorites + Ratings state management (localStorage)
    App.jsx                 # Main app component
    main.jsx                # Entry point
    index.css               # Global styles & Tailwind directives
    App.css                 # Component-specific styles
   ```

   ##  Setup Instructions

   ### Prerequisites
   - Node.js (v16 or higher)
   - npm or yarn

   ### Installation

   1. **Navigate to the project directory**:
      ```bash
      cd movie-search-app
      ```

   2. **Install Dependencies**:
      ```bash
      npm install
      ```

   3. **API Key Configuration**:
      The project includes a demo OMDB API key. To use your own:
      - Create or update the .env file:
        ```
        VITE_OMDB_API_KEY=your_api_key_here
        ```
      - Get your free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)

   4. **Start Development Server**:
      ```bash
      npm run dev
      ```
      The app will be available at http://localhost:5174

   5. **Build for Production**:
      ```bash
      npm run build
      ```

   6. **Preview Production Build**:
      ```bash
      npm run preview
      ```

   ##  Recent Improvements (v1.1.1)

   ### Image Loading & Display
   - Fixed poster image loading with intelligent fallbacks
   - Added loading skeleton animations while images fetch
   - Implemented CORS attribute for Amazon CDN support
   - Lazy loading for list view images (better performance)
   - Eager loading for detail page images (better UX)
   - Smooth opacity transitions for image display

   ### Performance Optimizations
   - API response caching (1-hour TTL)
   - Retry logic for failed API calls
   - Request deduplication
   - Image lazy loading support

   ### Code Quality & New Features
   - Added `StarRating.jsx` component for 1–5 star user ratings
   - Persisted user ratings in `localStorage` (key: `movieRatings`)
   - Integrated ratings into `MovieCard.jsx` and `MovieDetails.jsx`
   - Improved error handling and logging
   - Better null/undefined checking

   ##  Application Features

   ### Search Functionality
   - Real-time search with suggestions
   - Search type filtering (Movies, Series, Episodes)
   - Recent search history
   - Quick search shortcuts
   - Full plot search support

   ### Movie Display
   - **Grid View**: Visual card layout with hover effects
   - **List View**: Compact list format for scanning
   - Rating badges (IMDb) and user ratings
   - Type indicators (Movie/Series/Episode)
   - Favorite toggle buttons
   - Display movie details and ratings

   ### Movie Details Page
   - Full poster image with backdrop
   - IMDb rating display (original /10)
   - User rating (1–5 stars) — click to set, double-click to clear
   - Complete plot summary
   - Cast and director information
   - Production details (country, runtime, genre)
   - Awards and nominations
   - Box office information
   - Favorite add/remove functionality

   ### Favorites Management
   - Persistent storage using localStorage
   - Quick add/remove from any page
   - Visual favorites page with all saved movies
   - Empty state messaging

   ##  How Ratings Work

   - Users can rate any movie 1–5 stars from the `MovieDetails` page using the interactive `StarRating` component.
   - Ratings are saved locally in the browser under the `movieRatings` key in `localStorage` and are scoped by `imdbID`.
   - The `MovieCard` shows the user's rating when present and IMDb's average rating is displayed (original /10 and scaled to /5 where appropriate).
   - To clear your rating, double-click a star in the `StarRating` component.

   ##  Testing the Rating Feature (Quick)

   1. Run the app:
      ```bash
      npm run dev
      ```
   2. Open the app at `http://localhost:5174` and search for a movie.
   3. Click a movie card to open the details page.
   4. Click a star to set your rating (1–5). Double-click a star to remove it.
   5. Return to the results page — the card will show your rating.

   ##  Configuration

   ### Environment Variables
   ```bash
   # .env file
   VITE_OMDB_API_KEY=your_api_key_here
   ```

   ### Tailwind Customization
   Edit tailwind.config.js to customize:
   - Primary color: #141414
   - Secondary color: #1f1f1f  
   - Accent color: #e50914 (Netflix red)

   ##  Troubleshooting

   ### No Images Displaying
   - **Fixed**: Images now load properly with CORS handling
   - Verify .env file contains correct API key
   - Check browser console for specific errors
   - Clear browser cache and refresh

   ### Ratings Not Persisting
   - Ensure your browser allows `localStorage` for the site
   - Check for errors in the browser console
   - Ratings are stored under the `movieRatings` key in `localStorage`

   ### Slow Performance
   - Clear browser cache/localStorage
   - Use built-in caching (enabled by default)
   - Check your internet connection
   - OMDB API may have rate limits on free tier

   ### API Errors
   - Verify API key is valid and has requests remaining
   - Check internet connection
   - Try using "Clear Cache & Retry" button
   - Visit OMDB API to check service status

   ### Movies Not Found
   - Try different search terms
   - Ensure you're using the correct movie title
   - Use the trending movies button as reference
   - Check OMDB API for data availability

   ##  Browser Support

   - Chrome/Chromium 
   - Firefox 
   - Safari 
   - Edge 

   ##  Learning Notes

   This project demonstrates:
   - React hooks (useState, useEffect, useContext)
   - Custom context for state management
   - React Router for multi-page navigation
   - API integration with error handling and caching
   - Responsive design patterns
   - Tailwind CSS utility classes
   - Image optimization techniques
   - LocalStorage for persistence

   ##  License

   This project is provided for educational purposes.

   ##  Contributing

   Feel free to fork, modify, and improve this project!

   ##  Support

   For issues or questions:
   1. Check the Troubleshooting section
   2. Review browser console for errors
   3. Verify API key configuration
   4. Clear cache and retry

   ---

   **Version**: 1.1.1  
   **Last Updated**: February 9, 2026  
   **Status**:  Fully Functional

   ````
