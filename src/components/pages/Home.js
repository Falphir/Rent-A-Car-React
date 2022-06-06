import '../../App.css'
import BannerSection from '../BannerSection'
import RoomsCard from '../Cards/allRooms/Rooms'
import Footer from '../Footer';



function Home() {

    return (
        <>
            <BannerSection />
            <RoomsCard></RoomsCard>
            <Footer />
        </>
    )
}

export default Home