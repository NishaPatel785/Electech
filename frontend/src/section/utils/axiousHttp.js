// Interceptors
import axios from "axios";

const axiosHttp=axios.create({
    baseURL : "http://localhost:6001/api/v1/",
});

// axiosHttp.interceptors.request.use(
//     (config)=>{
        // const token =sessionStorage.getItem("token")

        // const token="ssffhsdjkfsd54564"
//         const token=null

//         const abc={
//             ...config,
//             headers :{
//                 ...(token && {Authorization : `Bearer ${token}` }),
//             }
//         }
//         console.log(abc)
//         return(abc)
//     },
//     (error)=>{
//         return Promise.reject(error)
//     }
// );

// axios.interceptors.request.use(
//     (response)=>{
//         return response
//     },
//     (error)=>{
//         return Promise.reject(error)
//     }
// )


export default axiosHttp;