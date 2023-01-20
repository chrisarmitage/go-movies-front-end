import { useEffect, useState } from "react"
import { json, useNavigate, useOutletContext, useParams } from "react-router-dom"
import Input from "./form/Input"
import Select from "./form/Select"
import TextArea from "./form/TextArea"

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
        description: ""
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

    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login")
            return
        }

    }, [jwtToken, navigate])

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
                </form>
            </div>
        </>
    )
}

export default EditMovie