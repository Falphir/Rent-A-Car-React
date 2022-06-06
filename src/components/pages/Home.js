import '../../App.css'
import BannerSection from '../BannerSection'
import CarsCard from '../Cards/allCars/Cars'
import Footer from '../Footer';



function Home() {

    return (
        <>
            <BannerSection />
            <CarsCard></CarsCard>
            <Footer />
        </>
    )
}

export default Home