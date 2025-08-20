





const CategoryModal =({data,imagepath})=>{
   
    return(
        <>
        <div className="pt-2 flex flex-col items-center">
         <h1 className="font-bold text-3xl">{data.name}</h1>
         <div>
            <img src= {`${imagepath}${data.cat_image}`}/>

         </div>
         <div>

         </div>

        </div>
        </>
    )
}

export default CategoryModal;