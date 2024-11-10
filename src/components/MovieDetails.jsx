import { useParams } from "react-router-dom";

export default function MovieDetails () {
    const { movieId } = useParams();
    return (
        <div>
            <h1>Movie Id { movieId }</h1>
        </div>
    )
}