
import classes from "./Homehead.module.css"

const Homehead=({title,link,onclick})=>{
    return(
        <>
        <div className={classes.title}>
            <h1 className={classes.h1}>
                {title}
            </h1>
            <h6 className={classes.h6} onClick={onclick}>{link}</h6>
        </div>

        </>
    )
}

export default Homehead