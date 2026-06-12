// import { PuffLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="loader-container">
            <h2>Loading...</h2>
            <video 
                loop autoPlay muted id="loader-video"
                src={`${import.meta.env.BASE_URL}video/loader.mp4`}
                type="video/mp4"
                poster={`${import.meta.env.BASE_URL}video/video-poster.jpg`}
                // width={400} height={400}   
            >
            </video>
            {/* <PuffLoader size={100} color="blue" /> */}
        </div>
    );
};