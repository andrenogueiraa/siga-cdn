function slugify(input) {
  return input
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, "") // Remove non-alphanumeric characters
    .trim();
}

function formatCNPJ(cnpj) {
  const regex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
  const match = cnpj.match(regex);
  if (match) {
    return match[1] + "." + match[2] + "." + match[3] + "/" + match[4] + "-" + match[5];
  } else {
    return cnpj;
  }
}

function brDate(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

function brDateTime(dateString) {
  const date = new Date(dateString);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formatter.format(date);
}

async function fetchData(url, target) {
  this[target].loading = true;
  this[target].data = null;
  const { error, data } = await useFetch(url);
  this[target].error = error;
  this[target].data = data;
  this[target].loading = false;
}

function getParam(regex) {
  const url = window.location.href;
  const match = url.match(regex);
  if (match) {
    return match[1];
  } else {
    console.log("Param not found in the URL");
    return;
  }
}

async function useFetch(url) {
  const csrftoken = document.cookie.replace(/(?:(?:^|.*;\s*)csrftoken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  try {
    const response = await fetch(url, {
      headers: {
        "X-CSRFToken": csrftoken,
      },
    });
    if (!response.ok) {
      if (response.status == 401) {
        let actual_url = window.location.href;
        window.location.replace(`/accounts/signin/?next=${actual_url}`);
        throw new Error(`Unauthorized`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    const data = await response.json();
    return { loading: false, error: null, data: data };
  } catch (error) {
    console.error(error);
    return { loading: false, error: error.message, data: null };
  }
}

function ParamsToURL(search, ordering, page) {
  // Update the search param in the URL
  const params = new URLSearchParams(window.location.search);
  if (search) {
    params.set("search", search);
  } else {
    params.delete("search");
  }

  // Update the ordering param in the URL
  if (ordering) {
    params.set("ordering", ordering);
  } else {
    params.delete("ordering");
  }

  // Update the page param in the URL
  if (page) {
    params.set("page", page);
  } else {
    params.delete("page");
  }

  // Update the browser's URL
  history.pushState({}, "", `?${params}`);

  // Return an object containing the updated search, ordering, and page values
  return { search: params.get("search"), ordering: params.get("ordering"), page: params.get("page") };
}
