const authorsTempalte = async () => {
  const authors = await getAuthors();
  const articles = await getArticles();
  const authorsSorted = authors.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  // console.log(authors);

  const articlesPerAuthor = authors.map(author => {
    let userArticles = articles.filter(obj => obj.authorId === author.id)
    return userArticles
  })
  for (let i = 0; i < authors.length; i++) {
    authors[i].articlesCount = articlesPerAuthor[i].length
  }
  // console.log(authors)

  // Search bar
  // const searchBar = document.getElementById('search_input');
  // searchBar.addEventListener('keyup', function (event) {
  //   const FilteredAuthors = authors.filter( obj  => {
  //     return 
  //       obj.name.includes(event)
  //   })
  //   console.log(event);
  // });
  // console.log(authors[0].name)


  //  Sorts the articles by A-Z Z-A
  function aZOrder() {
    authors.sort(function (a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (b.name > a.name) {
        return -1;
      }
      return 0;
    });
  }
  aZOrder()

  function zAOrder() {
    authors.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (b.name > a.name) {
        return 1;
      }
      return 0;
    });
  }

  //  Sorts the articles by most commented articles
  function mostArticles() {
    authors.sort(function (a, b) {
      if (a.articlesCount > b.articlesCount) {
        return 1;
      }
      if (b.articlesCount > a.articlesCount) {
        return -1;
      }
      return 0;
    });
  }

  function leastArticles() {
    authors.sort(function (a, b) {
      if (a.articlesCount > b.articlesCount) {
        return -1;
      }
      if (b.articlesCount > a.articlesCount) {
        return 1;
      }
      return 0;
    });
  }

  const authorsTpl = `

  <div class="bg-warning">
            <div class="container">
                <div class="pt-4 pb-4">
                  <div class="float-right btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span class="pr-2" id="current-sorting">A-Z</span>
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item a-z">A-Z</a>
                      <a class="dropdown-item z-a">Z-A</a>
                      <a class="dropdown-item comm-m">Most Articles</a>
                      <a class="dropdown-item comm-l">Least Articles</a>
                    </div>
                  </div>                    
                  <h2 class="text-dark mb-0"><b>Authors</b></h2>
                </div>
            </div>
        </div>
      {{#authors}}
        <main>
          <div class="container">
            <div class="row">
              <div class="card border border-dark mt-4 col-12">
              <div class="card-body">
                <div class='float-left pr-4'>
                  <a class="text-dark" href="../author/?id={{ id }}">
                    <img class="rounded-circle border border-warning img-border mt-3" src="{{ avatar }}">
                  </a>
                </div>
                <h6 class="card-subtitle mt-3 text-muted">Author:</h6>
                <a class="text-warning text-decoration-none" href="../author/?id={{ id }}">
                  <h4>{{ name }}</h4>
                </a>
                <a class="text-warning text-decoration-none" href="../author/?id={{ id }}">
                  <h5>@{{ username }}</h5>
                </a>
                <a class="text-secondary text-decoration-none" href="mailto: {{ email }}">
                  <i class="fa fa-envelope pr-2"></i>{{ email }}
                </a>
                <br>
                <a class="text-secondary text-decoration-none" href="{{ website }}">
                  <i class="fa fa-globe pr-2"></i> {{ website }}
                </a>
                <p class="text-muted m-bio mt-4">"{{ bio }}"</p>
                <a href="../author/?id={{ id }}" class="float-right btn btn-warning">Articles: <b>{{ articlesCount }}</b></a>
          </div>
        </main>
      {{/authors}}
    
      <div class="container">
            <nav aria-label="users-pagination">
                <ul class="pagination justify-content-center mt-4">
                    {{ #previousNext }}
                        <li class="page-item {{ enableDisablePrev }}">
                            <a class="page-link prev-next" prev-next="minus" href="#" tabindex="-1" aria-disabled="true"><<</a>
                        </li>
                        {{#pages}}
                            <li class="page-item {{ activeClass }}">
                                <a class="page-link page-number" data-page={{ dataPage }} href="#">{{ label }}</a>
                            </li>
                        {{/pages}}
                        <li class="page-item {{ enableDisableNext }}">
                            <a class="page-link prev-next" prev-next="plus" href="#">>></a>
                        </li>
                    {{ /previousNext }}
                </ul>
            </nav>
        </div>

    </div>
  `;

  //  Pagination
  let currentPage = 0;
  const ITEMS_PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(authors.length / ITEMS_PER_PAGE);

  const getPages = (currentPage) => {
    let pages = [];

    for (let i = 0; i < TOTAL_PAGES; i++) {
      pages.push({
        dataPage: i,
        label: i + 1,
        activeClass: currentPage === i ? 'active' : ''
      })
    }
    return pages;
  }

  //  Previous and next buttons dissable
  function paginationNvg(currentPage) {
    let buttonDisable = [{
      enableDisablePrev: currentPage === 0 ? 'disabled' : '',
      enableDisableNext: currentPage === (TOTAL_PAGES - 1) ? 'disabled' : ''
    }]
    return buttonDisable;
  }
  paginationNvg(currentPage)

  const updateHTML = () => {
    document.getElementById('root').innerHTML = Mustache.render(authorsTpl, {
      authors: authors.slice(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE * (currentPage + 1)),
      pages: getPages(currentPage),
      previousNext: paginationNvg(currentPage)
    })
  }
  updateHTML()


  //  Adding event listeners to the tagsTpl
  const authorsMain = document.getElementById('root');
  authorsMain.addEventListener('click', (event) => {

    if (event.target.matches("a.prev-next")) {

      if (event.target.getAttribute('prev-next') === 'minus') {
        currentPage--;

        updateHTML()
      } else {
        currentPage++;

        updateHTML()
      }
    } else if (event.target.matches("a.page-number")) {
      currentPage = event.target.getAttribute('data-page') * 1;

      updateHTML()

    } else if (event.target.matches(".dropdown-item")) {
      event.preventDefault();

      if (event.target.matches(".a-z")) {
        currentPage = 0;
        currentSorting = event.target.innerHTML;
        aZOrder();

      } else if (event.target.matches(".z-a")) {
        currentPage = 0;
        currentSorting = event.target.innerHTML;
        zAOrder();

      } else if (event.target.matches(".comm-m")) {
        currentPage = 0;
        currentSorting = event.target.innerHTML;
        leastArticles();

      } else if (event.target.matches(".comm-l")) {
        currentPage = 0;
        currentSorting = event.target.innerHTML;
        mostArticles();

      }
      updateHTML()
      document.getElementById('current-sorting').innerHTML = currentSorting
    }
  });

}

authorsTempalte();
