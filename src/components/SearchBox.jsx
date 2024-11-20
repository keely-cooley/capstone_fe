const SearchBox = (props) => {
  return (
    <div className="search-box">
      <input
        className="form-control"
        value={props.value}
        //any time value changes, store it in searchValue
        onChange={(event) => props.setSearchValue(event.target.value)}
        placeholder="type to search..."
      ></input>
    </div>
  );
};

export default SearchBox;
