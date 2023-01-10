import { useState } from "react"
import Input from "./form/Input"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()

        if (email === "admin@example.com") {
            
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
                        onChance={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        title="Password"
                        type="password"
                        className="form-control"
                        name="password"
                        autoComplete="off"
                        onChance={(event) => setPassword(event.target.value)}
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