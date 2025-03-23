import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UserContext from "../../Context/UserContext";
import MovieData from "../../Movies/MovieData";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "/api/v1";
import axios from "axios";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);
  const [scrollSearch, setscrollSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredMovies, setFilteredMovies] = useState([]); // State for filtered movie suggestions
  const [allMovies, setAllMovies] = useState([])

  const { auth, setAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const handleProClick = () =>{
    navigate('/subscription') ;
  }

  // Handle the scroll event to change the navbar style
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }

    if(window.scrollY > 600){
      setscrollSearch(true) ;
    }else setscrollSearch(false) ;
  };

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/movie/getMovieTitle`);
        setAllMovies(data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies() ;

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value) ;

    if(e.target.value === ""){
      setFilteredMovies([]) ;
    }

    if (searchQuery.trim() === "") {
      setFilteredMovies([]);
      setSearchQuery("") ;
    } else {
      const filtered = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }

  // Handle navigation to the movie details page
  const handleMovieClick = (id) => {
    setSearchQuery(""); // Clear the search bar
    setFilteredMovies([]); // Clear the suggestions
    navigate(`/movie/${id}`);
  };

  return (
    <header
      className={`text-white fixed z-50 top-0 left-0 w-full px-6 bg-transparent transition-all duration-300 ease-in-out ${
        scrolling ? "py-2 backdrop-blur-md" : "py-4 bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="logo text-xl font-bold">
          <NavLink to="/">
            <h1>MyLogo</h1>
          </NavLink>
        </div>

        <nav className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-white hover:text-blue-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-white hover:text-blue-500"
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="relative">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearch}
            className={`px-4 py-2 bg-transparent border ${scrollSearch ? 'border-pink-800' : 'border-white'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {filteredMovies.length > 0 && (
            <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="px-4 py-2 text-black cursor-pointer border border-none hover:bg-gray-200"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  {movie.title}
                  
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="about">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-semibold"
                : "text-white hover:text-blue-500"
            }
          >
            About
          </NavLink>
        </div>

        <div className="auth-buttons flex space-x-4">
          {!auth && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 font-semibold"
                  : "text-white hover:text-blue-500"
              }
            >
              Login
            </NavLink>
          )}
          {!auth && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive
                  ? "text-red-600 font-semibold"
                  : "text-white hover:text-blue-500"
              }
            >
              Register
            </NavLink>
          )}
          {
  auth && (
    <button 
      onClick={handleProClick}
      className="text-white hover:text-blue-500 font-semibold bg-transparent border-none cursor-pointer flex items-center space-x-2"
    >
      <span>Pro</span>
      <span role="img" aria-label="crown" className="text-yellow-400">👑</span> {/* Crown emoji */}
    </button>
  )
}


          {auth && (
            <button
              onClick={() => setAuth(false)} // Set auth to false on logout
              className="text-white hover:text-blue-500 font-semibold bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
