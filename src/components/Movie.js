import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Movie = () => {
    const [ movie, setMovie] = useState({})

    // id must match the route parameter
    let { id } = useParams()

    useEffect(() => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json")

        const rqOpts = {
            method: "GET",
            headers: headers,
        }

        fetch(`/movies/${id}`, rqOpts)
            .then(rs => rs.json())
            .then(data => { setMovie(data) })
            .catch(err => { console.error(err) })
    }, [id])

    if (movie.genres) {
        // Cast to array (i think)
        movie.genres = Object.values(movie.genres)
    } else {
        movie.genres = []
    }

    return (
        <>
            <div>
                <h2>Movie: {movie.title}</h2>
                <small><em>{new Date(movie.release_date).toLocaleDateString()}, {movie.runtime} minutes, rated {movie.mpaa_rating}</em></small>
                <br />
                {movie.genres.map(g => (
                    <span key={g.genre} className="badge bg-secondary me-2">{g.genre}</span>
                ))}
                <hr />

                {movie.image !== "" && 
                    <div className="mb-3">
                        <img src={`https://image.tmdb.org/t/p/w200/${movie.image}`} alt="poster" />
                    </div>
                }

                <p>{movie.description}</p>
            </div>
        </>
    )
}

export default Movie