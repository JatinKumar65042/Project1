import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AddMovie = () => {
    const navigate = useNavigate() ;
    useEffect(() => {
        const role = localStorage.getItem("role");  // Retrieve role from local storage
        if (role !== "ADMIN") {
            navigate("/denied");  // Redirect if role is not ADMIN
        }
    }, []);

    const genreOptions = ["Action", "Comedy", "Drama", "Horror", "Romance"];

    const [movieData, setMovieData] = useState({
        moviename : "",
        description : "" ,
        genre : [] ,
        releaseDate : "" ,
    }) ;
    const [posterUrl, setPosterUrl] = useState(null)
    const [movievideo, setMovievideo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMovieData({
            ...movieData ,
            [e.target.name] : e.target.value
        })
    }

    const handleFileChange = (e) => {
        if(e.target.name === "posterUrl"){
            setPosterUrl(e.target.files[0]) ;
        }
        else{
            setMovievideo(e.target.files[0]) ;
        }
    }

    const handleSubmit = async(e) => {
        // console
        // e.prevent.default() ;
        e.preventDefault() ;
        setLoading(true) ;
        const formData = new FormData() ;
        formData.append("moviename" , movieData.moviename) ;
        formData.append("description" , movieData.description) ;
        formData.append("genre" , JSON.stringify(movieData.genre)) ;
        console.log(JSON.stringify(movieData.genre))
        // formData.append("genre", JSON.stringify([...movieData.genre])); // also works same 
        formData.append("releaseDate" , movieData.releaseDate) ;
        formData.append("posterUrl" , posterUrl) ;
        formData.append("movievideo" , movievideo) ;

        try {
            // console.log("hello") ;
            const response = await axios.post(`${API_BASE_URL}/movie/addmovie` , 
            formData , 
            {headers : {
                "Content-Type": "multipart/form-data",
            }, withCredentials: true} , {
                withCredentials: true,
            }
            )
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error adding movie:", error);
            setMessage("Failed to add movie");
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-5 pt-20">
        <div className="max-w-2xl w-full p-6 bg-gray-800 shadow-2xl rounded-lg backdrop-blur-lg bg-opacity-70">
            <h2 className="text-2xl font-extrabold text-center text-blue-400 mb-4">🎬 Add Movie</h2>
            {message && <p className="text-green-400 text-center mb-2">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Movie Name:</label>
                    <input type="text" name="moviename" placeholder="Enter movie name" required 
                        className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        value={movieData.moviename} onChange={handleChange} />
                </div>

                <div>
                    <label className="block font-semibold">Description:</label>
                    <textarea name="description" placeholder="Enter description" required 
                        className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        value={movieData.description} onChange={handleChange} />
                </div>

                <div>
                    <label className="block font-semibold">Genre (Select multiple):</label>
                    <div className="grid grid-cols-2 gap-2">
                        {genreOptions.map((genre) => (
                            <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={genre}
                                    className="accent-blue-500 cursor-pointer"
                                    checked={movieData.genre.includes(genre)}
                                    onChange={(e) => {
                                        const selectedGenres = movieData.genre.includes(genre)
                                            ? movieData.genre.filter((g) => g !== genre)
                                            : [...movieData.genre, genre];
                                        setMovieData({ ...movieData, genre: selectedGenres });
                                    }}
                                />
                                <span className="hover:text-blue-400">{genre}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-semibold">Release Date:</label>
                    <input type="date" name="releaseDate" required 
                        className="w-full p-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                        value={movieData.releaseDate} onChange={handleChange} />
                </div>

                <div>
                    <label className="block font-semibold">Upload Poster:</label>
                    <input type="file" name="posterUrl" accept="image/*" required 
                        className="w-full p-2 border rounded bg-gray-700 text-white cursor-pointer file:bg-blue-500 file:text-white file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer hover:file:bg-blue-600"
                        onChange={handleFileChange} />
                </div>

                <div>
                    <label className="block font-semibold">Upload Movie Video:</label>
                    <input type="file" name="movievideo" accept="video/*" required 
                        className="w-full p-2 border rounded bg-gray-700 text-white cursor-pointer file:bg-blue-500 file:text-white file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer hover:file:bg-blue-600"
                        onChange={handleFileChange} />
                </div>

                <button type="submit" className="w-full p-2 mt-2 bg-blue-600 text-white font-bold rounded-lg transition-all duration-200 hover:bg-blue-700 active:scale-95 disabled:bg-gray-500" disabled={loading}>
                    {loading ? "Uploading..." : "Add Movie"}
                </button>
            </form>
        </div>
    </div>
    );
}

export default AddMovie
