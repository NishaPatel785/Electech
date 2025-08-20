import classes from "./Loading.module.css"
const Loading=()=>{
    return(

        <>
        <div className={classes.main}>
            <div className={classes.laod}></div>
            {/* <img src="./loading1_1_100X100.gif" alt="loading" /> */}
        </div>
        </>
    )
}

export default Loading;