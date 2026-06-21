import './uibuttons.css';

const classNames = classNames => classNames.join(" ");

const Button = ({ className = "", primary, secondary, ...props}) => {
return (
    <button
     type="button" 
     className={classNames([
         "uibutton",
         className,
         primary ? "uibutton--primary" : "",
         secondary ? "uibutton--secondary" : ""
        ])} 
     {...props}
     />
    );
} 

const FloatingButton = ({ className = "", ...props }) => {
    return (
        <Button
            className={classNames([
                "uibutton--floating",
                className
            ])}
            {...props}
        />
    )
}

const ButtonContainer = ({className = "", children, ...props}) => {
    return(
        <div
            className={classNames(["uibutton_container", className])}
            {...props}>
            {children}
        </div>
        )
}

const ButtonAppContainer = ({className = "", children, ...props}) => {
    return(
        <div
            className={classNames(["uibutton_appcontainer", className])}
            {...props}>
                {children}
        </div>
    )
}

export { Button as default, Button, FloatingButton, ButtonContainer, ButtonAppContainer }  

