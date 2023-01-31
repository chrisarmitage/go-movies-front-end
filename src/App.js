import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Alert from './components/Alert';

function App() {
  const [jwtToken, setJwtToken] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertClassName, setAlertClassName] = useState("d-none")

  const [tickInterval, setTickInterval] = useState()

  const navigate = useNavigate()

  const logout = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch(`${process.env.REACT_APP_BACKEND}/logout`, requestOptions)
      .catch(error => {
        console.log('error logging out', error)
      })
      .finally(() => {
        setJwtToken("")
        toggleRefresh(false)
      })

    navigate("/login")
  }

  const toggleRefresh = useCallback((status) => {
    console.log('clicked')

    if (status) {
      console.log('turn on ticking')
      let i = setInterval(() => {
        console.log('every ten minutes')

        // Duplicated code
        const requestOptions = {
          method: "GET",
          credentials: "include",
        }
  

        fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
          .then(response => response.json())
          .then (data => {
            if (data.access_token) {
              setJwtToken(data.access_token)
            }
          })
          .catch(error => {
            console.log("User is not logged in", error)
          })
      }, 10 * 60 * 1000) 
      setTickInterval(i)
      console.log('setting tickInterval to i')
    } else {
      console.log('turn off ticking')
      setTickInterval(null)
      clearInterval(tickInterval)
    }
  }, [tickInterval])

  useEffect(() => {
    if (jwtToken === "") {
      // Duplicated code
      const requestOptions = {
        method: "GET",
        credentials: "include",
      }

      fetch(`${process.env.REACT_APP_BACKEND}/refresh`, requestOptions)
        .then(response => response.json())
        .then (data => {
          if (data.access_token) {
            setJwtToken(data.access_token)
            toggleRefresh(true)
          }
        })
        .catch(error => {
          console.log("User is not logged in", error)
        })
    }
  }, [jwtToken, toggleRefresh])


  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go watch a movie</h1>
        </div>
        <div className="col text-end">
          {jwtToken === ""
          ? <Link to="/login"><span className="badge bg-success">Login</span></Link>
          : <a href onClick={logout}><span className="badge bg-danger">Logout</span></a>
          }
        </div>
        <hr className="mb-3" />
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">Home</Link>
              <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
              <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
              {jwtToken !== "" &&
              <>
              <Link to="/admin/movie/0" className="list-group-item list-group-item-action">Add Movie</Link>
              <Link to="/manage-catalog" className="list-group-item list-group-item-action">Manage Catalog</Link>
              <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
              </>
}
            </div>
          </nav>
        </div>

        <div className="col-md-10">
          {/* <a className='btn btn-outline-secondary' href='#!' onClick={toggleRefresh}>Toggle ticking</a> */}
          <Alert
            message={alertMessage}
            className={alertClassName}
          />
          {/* Passes the jwtToken and setJwtToken down to all child pages */}
          <Outlet context={{
            jwtToken, setJwtToken,
            setAlertMessage, setAlertClassName, toggleRefresh
          }}/>
        </div>
      </div>
    </div>
  );
}

export default App;
