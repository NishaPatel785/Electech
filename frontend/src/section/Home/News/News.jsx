
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import classes from "./News.module.css"
import image1 from "./01.jpg"
import image2 from "./02.jpg"
import image3 from "./03.jpg"
import image4 from "./04.jpg"
import image5 from "./05.jpg"
import image6 from "./06.jpg"
import {Row,Col} from "react-bootstrap"
import { MdOutlineWatchLater } from "react-icons/md";
import Homehead from "../../../components/Homehead/Homehead"
const News=()=>{
      const news=[
        {   
            Img:image1,
            name:"Why Is My Laptop So Slow? Simple Fixes You Can Try",
            date:"December 12, 2024",
            detail:"Are you curious about the latest trends in your industry? As a product or industry expert, it's crucial to stay up-to-date with the ever-changing landscape. In this blog post, we will delve into the world of trends and explore why they matter. Let's get started!"
        },
        {   
            Img:image2,
            name:"Easy Steps to Protect Your Electronics from Damage",
            date:"December 12, 2024",
            detail:"Welcome to the ultimate shopping event that you've been waiting for! Our upcoming shopping sale is set to dazzle and delight, offering you the chance to snag your favorite items at unbelievable prices. Whether you're a fashionista, a tech enthusiast, or someone looking to revamp your home decor, our sale has something for everyone. In our exciting blog series, we'll be unraveling the details of this shopping extravaganza that's set to dazzle and delight. From irresistible discounts on your favorite brands to exclusive previews of the trendiest collections, our sale event promises to be an unforgettable journey through the world of fashion, lifestyle, and more."
        },
        {   
            Img:image3,
            name:"How to Save Money on Your Next Electronics Purchase",
            date:"December 12, 2024",
            detail:"Welcome to the digital world, where technology is constantly evolving and shaping the way we live, work, and communicate. In this blog post, we will delve into the exciting advancements and trends that are revolutionizing our digital landscape."
        },
        {   
            Img:image4,
            name:"What's the Best Way to Organize Your Electronic Cords?",
            date:"December 12, 2024",
            detail:"Fashion, like a beautifully crafted painting or a captivating piece of literature, has the power to evoke emotions and make a statement. It is a medium through which individuals express their unique personalities, tastes, and desires. Just as an artist carefully selects colors and textures, fashion enthusiasts curate their wardrobes with meticulous attention to detail. Fashion is not merely about clothing; it is an embodiment of elegance, sophistication, and self-expression. It is a language that speaks volumes without uttering a word. The right ensemble can transform an individual, exuding confidence and allure. Fashion is an art form that allows individuals to create their own narratives, leaving an indelible mark on the world."
        },
        {   
            Img:image5,
            name:"Top 5 Tips for Choosing the Right Smartphone",
            date:"December 12, 2024",
            detail:"Welcome to our dynamic technology blog, where innovation meets exploration and the digital world comes to life. In this riveting blog post series, we embark on a journey through the ever-evolving landscape of technology, uncovering cutting-edge advancements, delving into fascinating trends, and unraveling the impact of tech on our lives."
        },
        {   
            Img:image6,
            name:"How to Fix Common Electronic Device Problems at Home",
            date:"December 12, 2024",
            detail:"Welcome to our vibrant blog, where curiosity meets knowledge and inspiration knows no bounds. As the renowned author X once said, The more you read, the more things you will know. The more that you learn, the more places you'll go."
        },
      ]

     
    return(
        <>

        <div className={classes.customHomeheadWrapper}>
        <Homehead title="Get Latest Update & News" />

        </div>

        <div className={`news ${classes.main_news}`}>

        <Swiper   spaceBetween={50} modules={[Navigation]} slidesPerView={4} breakpoints={{
    0: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
    1240: {
      slidesPerView: 4,
    },
  }} className="newsSwiper">
  {news.map((news, index) => (
      <SwiperSlide key={index}>
      <Col lg={4} md={6} sm={12} xs={12} className={`${classes.multi}`}>
        <img src={news.Img} alt={news.name} className="img-fluid"  />
        <div><MdOutlineWatchLater/>  {news.date}</div>
        <h5 className="text-truncate d-block w-100">{news.name}</h5>
        <p className="text-truncate d-block w-100">{news.detail}</p>
      </Col>
    </SwiperSlide>
  ))}
</Swiper>
  </div>

      
    
        </>
    )
}

export default News;