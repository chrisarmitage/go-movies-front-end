import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"


const OneGenre = () => {
    // get the prop passed in to the component
    const location = useLocation()
    const { genreName } = location.state

    // set stateful vars
    const [ movies, setMovies ] = useState([])
    
    // get ID from URL
    let { id } = useParams()
    
    // get list of movies
    useEffect(() => {
        const rqHeaders = new Headers()
        rqHeaders.append("Content-Type", "application/json")

        const rqOptions = {
            method: "GET",
            headers: rqHeaders,
        }

        fetch(`/movies/genres/${id}`, rqOptions)
            .then(rs => rs.json())
            .then(data => {
                if (data.error) {
                    console.log(data.message)
                } else {
                    setMovies(data)
                }
            })
            .catch(err => { console.log(err) })

    }, [id])

    return (
        <>
        <h2>Genre: {genreName}</h2>
        <hr />

        {movies.length > 0 ? (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Movie</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {movies.map(m => (
                        <tr key={m.id}>
                            <td>
                                <Link to={`/movies/${m.id}`}>{m.title}</Link>
                            </td>
                            <td>{m.release_date}</td>
                            <td>{m.mpaa_rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No movies in this genre</p>
        )}
        </>
    )
}

export default OneGenre
