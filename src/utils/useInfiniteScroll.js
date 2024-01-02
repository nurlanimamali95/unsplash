import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = (fetchCallback, totalPages) => {
  const scrollObserver = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const handleIntersect = async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isFetching) {
        setIsFetching(true);
        await fetchCallback();
        setIsFetching(false);
      }
    };

    scrollObserver.current = new IntersectionObserver(handleIntersect, observerOptions);

    if (totalPages > 1) {
      scrollObserver.current.observe(document.querySelector("#bottom-sentinel"));
    }

    return () => {
      if (scrollObserver.current) {
        scrollObserver.current.disconnect();
      }
    };
  }, [fetchCallback, isFetching, totalPages]);

  return <div id="bottom-sentinel" style={{ border: "1px solid red", height: "10px" }} />;
};

export default useInfiniteScroll;