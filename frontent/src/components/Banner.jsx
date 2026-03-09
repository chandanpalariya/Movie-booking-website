import React from 'react'
import { bannerStyles } from '../assests/dummyStyles'
import Video from "../assests/MovieBannerVideo.mp4"
import { Star,Tickets,Info } from 'lucide-react'

const Banner = () => {
  return (
    <div className={bannerStyles.container}>
        <div className={bannerStyles.videoContainer}>
            <video  autoPlay loop muted playsInline className={bannerStyles.video} >
                <source src={Video} type='video/mp4'/>
                {/* fallback text */}
                your browser does not support the video tag
      
            </video>
            <div className={bannerStyles.overlay}>

            </div>

        </div>
        {/*  content section */}
         <div className={bannerStyles.content}>
          <div className={bannerStyles.contentInner}>
            <h1 className={bannerStyles.title} style={ 
              {
                fontFamily:" 'Dancing Script ',cursive"
              }
            }>
              Ocean's Legacy
            </h1>
            <p className={bannerStyles.description}>
              An epic adventure beneath the waves.Explore the mysteries of the deep ocen and discover treasures imagination in this breathing cinemetic experience

            </p>
            <div className={bannerStyles.ratingContainer}>
              <div className={bannerStyles.ratingContainer}>
               
              <div className={bannerStyles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={bannerStyles.star}
                    aria-hidden="true"
                  />
                ))}
                <span className={bannerStyles.ratingText}>4.8/5</span>
              </div>

•             <div className={bannerStyles.genreText}>
                Adventure+Fantasy+Drama
             </div>
              </div>

              <div className={bannerStyles.buttonsContainer}>
                <a href="/movies" className={bannerStyles.bookButton}>
                <Tickets className={bannerStyles.icon} fill='white'/>
                Book Movies
                </a>
                <a href="/contact" className={bannerStyles.infoButton}>
                <Info className={bannerStyles.icon}/>
                More Info
                </a>

              </div>

            </div>

          </div>
          <style>
            {bannerStyles.customCSS}
          </style>

         </div>
    </div>
  )
}

export default Banner
