import { useEffect } from "react";

// TODO: Deprecate this page.
function Search() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <h1>SEARCH PAGE</h1>
    </>
  );
}

export default Search;
