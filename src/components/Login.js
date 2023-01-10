import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import App from "../App"
import Input from "./form/Input"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Passed down from the Outlet context in App.js
    const { setJwtToken } = useOutletContext()
    const { setAlertMessage } = useOutletContext()
    const { setAlertClassName } = useOutletContext()

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log("[email, pass]", email, password)

        if (email === "admin@example.com") {
            setJwtToken("ey")
            setAlertMessage("")
            setAlertClassName("d-none")
            navigate("/")
        } else {
            setAlertMessage("Invalid credentials")
            setAlertClassName("alert-danger")
        }
    }

    return (
        <>
            <div className="col-md-6 offset-md-3">
                <h2>Login</h2>
                <hr />

                <form onSubmit={handleSubmit}>
                    <Input
                        title="Email address"
                        type="email"
                        className="form-control"
                        name="email"
                        autoComplete="off"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        title="Password"
                        type="password"
                        className="form-control"
                        name="password"
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <hr />
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Login"
                    />
                </form>
            </div>
        </>
    )
}

export default Login