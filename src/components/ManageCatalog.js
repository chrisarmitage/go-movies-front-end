import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router-dom"

const ManageCatalog = () => {
    
    const [ movies, setMovies] = useState([])

    const { jwtToken } = useOutletContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "") {
            console.log("token", jwtToken)
            navigate("/login")
            return
        }

        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)

        const rqOpts = {
            method: "GET",
            headers: headers,
        }

        fetch(`${process.env.REACT_APP_BACKEND}/admin/movies`, rqOpts)
            .then(rs => rs.json())
            .then(data => setMovies(data))
            .catch(err => console.error(err))
    }, [jwtToken, navigate])

    return (
        <>
            <div>
                <h2>Manage Catalog</h2>
                <hr />
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
                                    <Link to={`/admin/movie/${m.id}`}>{m.title}</Link>
                                </td>
                                <td>{new Date(m.release_date).toLocaleDateString()}</td>
                                <td>{m.mpaa_rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ManageCatalog