export function createURL({
  search,
  imdbID,
}: {
  search?: string;
  imdbID?: string;
}): URL {
  const url = new URL(`https://www.omdbapi.com/`);
  url.searchParams.set("apikey", "7ab33eb9");

  if (search) {
    url.searchParams.set("s", search);
  } else if (imdbID) {
    url.searchParams.set("i", imdbID);
  }

  return url;
}

export function createCancellableFetch() {
  let controller = new AbortController();
  let signal = controller.signal;

  return async function mainCancellableFetch(url: URL) {
    controller.abort();

    // reassign signal
    controller = new AbortController();
    signal = controller.signal;

    const response = await fetch(url, { signal });
    const data = await response.json();

    return data;
  };
}
