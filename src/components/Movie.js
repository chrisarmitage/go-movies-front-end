import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const Movie = () => {
    const [ movie, setMovie] = useState({})

    // id must match the route parameter
    let { id } = useParams()

    useEffect(() => {
        let movies = [
            {
                id: 1,
                title: "Highlander",
                release_date: "1986-03-07",
                runtime: 116,
                mpaa_rating: "R",
                description: "Description of film",
            },
            {
                id: 2,
                title: "Raiders of the Lost Ark",
                release_date: "1981-06-12",
                runtime: 115,
                mpaa_rating: "PG-13",
                description: "Description of film",
            },
        ]

        const movie = movies.find(movie => {
            return movie.id == id
        })

        setMovie(movie)
    }, [id])

    return (
        <>
            <div>
                <h2>Movie: {movie.title}</h2>
                <small><em>{movie.release_date}, {movie.runtime} minutes, rated {movie.mpaa_rating}</em></small>
                <hr />
                <p>{movie.description}</p>
            </div>
        </>
    )
}

export default Movie