import { useEffect, useState } from "react"
import { json, useNavigate, useOutletContext, useParams } from "react-router-dom"
import Input from "./form/Input"
import Select from "./form/Select"
import TextArea from "./form/TextArea"
import Checkbox from "./form/Checkbox"

const EditMovie = () => {
    const navigate = useNavigate()
    const { jwtToken } = useOutletContext()

    const [ error, setError]  = useState(null)
    const [ errors, setErrors ] = useState([])
    const [ movie, setMovie ] = useState({
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_array: [Array(13).fill(false)],
    })

    const mpaaOptions = [
        { id: "G", value: "G", },
        { id: "PG", value: "PG", },
        { id: "PG-13", value: "PG-13", },
        { id: "R", value: "R", },
        { id: "NC-17", value: "NC-17", },
        { id: "18A", value: "18A", },
    ]
    
    // get ID from URL
    let { id } = useParams()
    if (id === undefined) {
        // Adding a movie, not editing one
        id = 0
    }

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login")
            return
        }

        if (id === 0) {
            // Add a movie

            // Clear the form, if not, going from edit to add will carry data over
            setMovie({
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                description: "",
                genres: [],
                genres_array: [Array(13).fill(false)],
            })

            const headers = new Headers();
            headers.append("Content-Type", "application/json")

            const rqOpts = {
                method: "GET",
                headers: headers,
            }
    
            fetch(`http://localhost:8080/genres`, rqOpts)
                .then(rs => rs.json())
                .then(data => {
                    const checks = [];
                    data.forEach(g => {
                        checks.push({id: g.id, genre: g.genre, checked: false})
                    })

                    setMovie(m => ({
                        ...m,
                        genres: checks,
                        genres_array: [],
                    }))
                })
                .catch(err => console.error(err))
        } else {
            // Edit a movie
        }

    }, [jwtToken, navigate, id])

    const handleSubmit = (event => {
        event.preventDefault()

    })

    const handleChange = () => (event) => {
        let value = event.target.value
        let name = event.target.name

        setMovie({
            ...movie,
            [name]: value
        })
    }

    const handleCheck = (event, position) => {
        console.log("handleCheck: ", event.target.value, event.target.checked)
        let tmpArr = movie.genres
        tmpArr[position].checked = !tmpArr[position].checked

        let tmpIds = movie.genres_array
        if (!event.target.checked) {
            tmpIds.splice(tmpIds.indexOf(event.target.value))
        } else {
            tmpIds.push(parseInt(event.target.value, 10))
        }

        setMovie({
            ...movie,
            genres_array: tmpIds
        })
    }

    const hasError = (key) => {
        return errors.indexOf(key) !== -1
    }

    return (
        <>
            <div>
                <h2>Add / Edit Movie</h2>
                <hr />

                <pre>{JSON.stringify(movie, null, 3)}</pre>

                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="id" name="id" value={movie.id} />

                    <Input
                        title={"Title"}
                        className={"form-control"}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "test-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release date"}
                        className={"form-control"}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "test-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input
                        title={"Runtime"}
                        className={"form-control"}
                        type={"text"}
                        name={"runtime"}
                        value={movie.runtime}
                        onChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "test-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select
                        title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        value={movie.runtime}
                        options={mpaaOptions}
                        placeholder={"Choose..."}
                        onChange={handleChange("mpaa_rating")}
                        errorDiv={hasError("mpaa_rating") ? "test-danger" : "d-none"}
                        errorMsg={"Please select a rating"}
                    />

                    <TextArea
                        title={"Description"}
                        name={"description"}
                        value={movie.description}
                        rows={"3"}
                        onChange={handleChange("description")}
                        errorDiv={hasError("description") ? "test-danger" : "d-none"}
                        errorMsg={"Please enter a description"}
                    />

                    <hr />

                    <h3>Genres</h3>

                    {movie.genres && movie.genres.length > 1 &&
                        <>
                            {Array.from(movie.genres).map((g, index) => 
                                <Checkbox 
                                    title={g.genre}
                                    name={g.genre}
                                    key={index}
                                    id={`genre-${index}`}
                                    onChange={(event) => handleCheck(event, index)}
                                    value={g.id}
                                    checked={movie.genres[index].checked}
                                />
                            )}
                        </>
                    }
                </form>
            </div>
        </>
    )
}

export default EditMovie