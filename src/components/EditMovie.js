import { useEffect, useState } from "react"
import { json, useNavigate, useOutletContext, useParams } from "react-router-dom"
import Input from "./form/Input"
import Select from "./form/Select"
import TextArea from "./form/TextArea"
import Checkbox from "./form/Checkbox"
import Swal from "sweetalert2"

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
            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            headers.append("Authorization", "Bearer " + jwtToken)

            const rqOpts = {
                method: "GET",
                headers: headers,
                credentials: "include"
            }

            fetch(`/admin/movies/${id}`, rqOpts)
                .then(rs => {
                    if (rs.status !== 200) {
                        setError("Invalid response code: " + rs.status)
                    }
                    return rs.json()
                })
                .then(data => {
                    data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0]

                    const checks = [];

                    data.genres.forEach(g => {
                        if (data.movie.genres_array.indexOf(g.id) !== -1) {
                            checks.push({id: g.id, checked: true, genre: g.genre})
                        } else {
                            checks.push({id: g.id, checked: false, genre: g.genre})
                        }
                    })

                    setMovie({
                        ...data.movie,
                        genres: checks
                    })
                })
                .catch(err => console.error(err))
        }

    }, [jwtToken, navigate, id])

    const handleSubmit = (event => {
        event.preventDefault()

        let errors = []
        let required = [
            { field: movie.title, name: "title", },
            { field: movie.release_date, name: "release_date", },
            { field: movie.runtime, name: "runtime", },
            { field: movie.description, name: "description", },
            { field: movie.mpaa_rating, name: "mpaa_rating", },
        ]

        required.forEach(function(obj) {
            if (obj.field === "") {
                errors.push(obj.name)
            }
        })

        if (movie.genres_array.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'You much choose at least one genre',
                icon: 'error',
                confirmButtonText: 'OK',
            })
            errors.push('genre')
        }

        setErrors(errors)

        if (errors.len > 0) {
            return false
        }

        // Passed all validation, time to save
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        headers.append("Authorization", "Bearer " + jwtToken)

        let method = "PUT"
        if (movie.id > 0) {
            method = "PATCH"
        }

        const rqBody = movie
        // Convert the release date and runtime
        rqBody.release_date = new Date(movie.release_date)
        rqBody.runtime = parseInt(movie.runtime, 10)

        const rqOpts = {
            method: method,
            headers: headers,
            body: JSON.stringify(rqBody),
            credentials: "include",
        }

        fetch(`/admin/movies/${movie.id}`, rqOpts)
            .then(rs => rs.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    navigate("/manage-catalog")
                }
            })
            .catch(err => {
                console.log(err)
            })
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

    const confirmDelete = () => {
        Swal.fire({
            title: 'Delete movie?',
            text: "You cannot undo this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                const headers = new Headers()
                headers.append("Authorization", "Bearer " + jwtToken)


                const rqOpts = {
                    method: "DELETE",
                    headers: headers,
                    credentials: "include",
                }
              fetch(`/admin/movies/${movie.id}`, rqOpts)
                .then(rs => rs.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        navigate("/manage-catalog")
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
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

                {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}

                <form onSubmit={handleSubmit}>
                    <input type="hidden" id="id" name="id" value={movie.id} />

                    <Input
                        title={"Title"}
                        className={"form-control"}
                        type={"text"}
                        name={"title"}
                        value={movie.title}
                        onChange={handleChange("title")}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input
                        title={"Release date"}
                        className={"form-control"}
                        type={"date"}
                        name={"release_date"}
                        value={movie.release_date}
                        onChange={handleChange("release_date")}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release date"}
                    />

                    <Input
                        title={"Runtime"}
                        className={"form-control"}
                        type={"text"}
                        name={"runtime"}
                        value={movie.runtime}
                        onChange={handleChange("runtime")}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select
                        title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        value={movie.mpaa_rating}
                        options={mpaaOptions}
                        placeholder={"Choose..."}
                        onChange={handleChange("mpaa_rating")}
                        errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please select a rating"}
                    />

                    <TextArea
                        title={"Description"}
                        name={"description"}
                        value={movie.description}
                        rows={"3"}
                        onChange={handleChange("description")}
                        errorDiv={hasError("description") ? "text-danger" : "d-none"}
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

                    <hr />
                    <button className="btn btn-primary">Save</button>
                    {movie.id > 0 && 
                    <a href="#!" className="btn btn-outline-danger ms-2" onClick={confirmDelete}>Delete</a>
                    }
                </form>
            </div>
        </>
    )
}

export default EditMovie