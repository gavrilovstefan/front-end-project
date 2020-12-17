const functions = async () => {
  const articles = await getArticles();
  const authors = await getAuthors();
  const comments = await getComments();
  const tags = await getTags();

  const commentsPerArticle = articles.map((article) => {
    let articles = comments.filter((obj) => obj.articleId === article.id);
    return articles;
  });

  for (let i = 0; i < articles.length; i++) {
    articles[i].commentsLength = commentsPerArticle[i].length;
  }

  // Changes the date to a human readable format
  articles.forEach((obj) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const year = obj.date.substring(0, 4);
    let month = obj.date.substring(5, 7);
    const day = obj.date.substring(8, 10);
    month = monthNames[month - 1];
    obj.date = day + " " + month + " " + year;
  });

  // Takes the authors and puts it in the articles object as an object
  for (let i = 0; i < articles.length; i++) {
    for (let j = 0; j < authors.length; j++) {
      if (articles[i].authorId === authors[j].id) {
        articles[i].author = authors[j];
      }
    }
  }
};
functions();

// Sorting function, takes three arguments - 1. Array of objects to sort, 2. What key of the object to sort by (String), 3. Ascending (asc), Descending(desc), a-z or z-a(String)
function sortBy(arr, key, order) {
  if (!(key === "date")) {
    arr.sort(function (a, b) {
      if (order === "asc" || order === "z-a") {
        if (a[key] > b[key]) {
          return -1;
        }
        if (b[key] > a[key]) {
          return 1;
        }
        return 0;
      } else if (order === "desc" || order === "a-z") {
        if (a[key] < b[key]) {
          return -1;
        }
        if (b[key] < a[key]) {
          return 1;
        }
        return 0;
      }
    });
  } else if (key === "date") {
    if (order === "asc") {
      arr.sort(function (a, b) {
        return new Date(b[key]) - new Date(a[key]);
      });
    } else if (order === "desc") {
      arr.sort(function (a, b) {
        return new Date(a[key]) - new Date(b[key]);
      });
    }
  }
}

// Creates the number of pages that there will be in the pagination.
const getPages = (numberOfPages, currentPage) => {
  let pages = [];

  for (let i = 0; i < numberOfPages; i++) {
    pages.push({
      dataPage: i,
      label: i + 1,
      activeClass: currentPage === i ? "active" : "",
    });
  }
  return pages;
};

//  Previous and next buttons dissable
function paginationNvg(numberOfPages, currentPage) {
  let buttonDisable = [
    {
      enableDisablePrev: currentPage === 0 ? "disabled" : "",
      enableDisableNext: currentPage === numberOfPages - 1 ? "disabled" : "",
    },
  ];
  return buttonDisable;
}
