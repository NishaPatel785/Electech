import Comments from "./Comments/Comments";
import HomeSection1 from "./HomeSection1/HomeSection1";
import Logo from "./logo/Logo";
import ShowCategory from "./ShowCategory/ShowCategory";
import Section3 from "./Section3/Section3";
import Button1 from "../../components/Button1/Button1";
import Services from "./Services/Services";
import { useNavigate } from "react-router-dom";
import Section4 from "./Section4/Section4";
import Search from "../Search/Search";
import News from "./News/News";
import LatestProducts from "./LatestProducts/LatestProducts";
import FeaturedProduct from "./FeaturedProduct/FeaturedProduct";
import Deal from "./Deal/Deal";
import TopButton from "../../components/TopButton/TopButton";

const HomeMain=()=>{

    const navigate=useNavigate();
    return(
        <>
        <HomeSection1/>
        <ShowCategory/>
        <Section3/>
        <LatestProducts/>
        <Services/>
        <Deal/>
        <FeaturedProduct/>
        <Comments/>
        <Section4/>
        <News/>
        <Logo/>
        <TopButton/>

        
        
        </>
    )
}
export default HomeMain;