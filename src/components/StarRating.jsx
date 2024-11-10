function StarRating({ rating, setRating }) {
  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div>
      <div>
        {stars.map((star) => (
          <span
            key={star}
            onClick={() => handleStarClick(star)}
            style={{
              cursor: "pointer",
              color: star <= rating ? "gold" : "gray",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default StarRating;
