import classes from "./Button1.module.css"

const Button1 =({name,onclick,...props})=>{
    return(
        <>
       <button {...props} onClick={onclick} className={classes.btn}>{name}</button>
        </>

    )
}

export default Button1;