import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetails () {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const previousPage = () => {
        navigate(-1)
    }

    return (
        <div className="movieDetailsContainer">
            <div>
            <h3>{ movieId }</h3>
            <button className="button" onClick={previousPage}>Previous Page</button>
            </div>
        </div>
    )
}