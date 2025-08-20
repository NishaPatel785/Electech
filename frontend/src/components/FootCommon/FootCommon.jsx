import classes from "./FootCommon.module.css";



const FootCommon=({name})=>{
    return(
        <>

        <h1 className={classes.h1}>{name}</h1>
        </>
    )
}

export default FootCommon;