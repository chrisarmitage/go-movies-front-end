import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Input from "./form/Input"

const GraphQL = () => {
    // Set up stateful vars
    const [ movies, setMovies ] = useState([])
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ fullList, setFullList ] = useState([])

    // perform a search
    const performSearch = () => {
        const payload = `
        {
            search(titleContains: "${searchTerm}") {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }
        `

        const rqHeaders = new Headers()
        rqHeaders.append("Content-type", "application/graphql")

        const rqOptions = {
            method: "POST",
            headers: rqHeaders,
            body: payload
        }

        fetch(`/graph`, rqOptions)
            .then(rs => rs.json())
            .then(data => {
                let list = Object.values(data.data.search) // `search` matches the `search` command
                setMovies(list)
            })
            .catch(err => { console.log(err)})

    }

    const handleChange = (event) => {
        event.preventDefault()

        let value = event.target.value
        setSearchTerm(value)

        if (value.length >= 3) {
            performSearch()
        } else {
            setMovies(fullList)
        }
    }

    // useEffect to load all movies
    useEffect(() => {
        const payload = `
        {
            list {
                id
                title
                runtime
                release_date
                mpaa_rating
            }
        }
        `

        const rqHeaders = new Headers()
        rqHeaders.append("Content-type", "application/graphql")

        const rqOptions = {
            method: "POST",
            headers: rqHeaders,
            body: payload
        }

        fetch(`/graph`, rqOptions)
            .then(rs => rs.json())
            .then(data => {
                let list = Object.values(data.data.list) // `list` matches the `list` command
                setMovies(list)
                setFullList(list)
            })
            .catch(err => { console.log(err)})
    }, [])

    return (
        <>
            <div>
                <h2>GraphQL</h2>
                <hr />
                <form onSubmit={handleChange}>
                    <Input
                        title="Search"
                        type="search"
                        name="search"
                        className="form-control"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                </form>

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
                                    <td>{new Date(m.release_date).toLocaleDateString()}</td>
                                    <td>{m.mpaa_rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No movies for this search</p>
                )}

            </div>
        </>
    )
}

export default GraphQL