import { PuffLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="loader-container">
            <PuffLoader size={100} color="blue" />
        </div>
    );
};