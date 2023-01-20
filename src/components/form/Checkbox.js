const Checkbox = props => {
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                id={props.name}
                name={props.name}
                type="checkbox"
                value={props.value}
                onChange={props.onChange}
                checked={props.checked}
            />
            <label className="form-check-label" htmlFor={props.name}>{props.title}</label>
        </div>
    )
}

export default Checkbox