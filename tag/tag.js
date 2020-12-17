const tagsTempalte = async () => {
  let articles = await getArticles();
  const authors = await getAuthors();
  const tags = await getTags();
  let currentSorting;
  sortBy(articles, "date", "asc");

  const urlParams = new URLSearchParams(window.location.search);
  const tagURL = urlParams.get("tag");
  let selectedTagName = "All Tags";
  if (tagURL) {
    articles = articles.filter((article) => {
      return article.tags.includes(tagURL);
    });
    selectedTagName = tags[tagURL];
  }

  const tagsTpl = `
    <main>
        <div class="bg-warning">
            <div class="container">
                <div class="pt-4 pb-4">

                    <div class="float-right btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2" id="current-sorting">Date (newest)</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item sort-by-dropdown date-n" href="./tag/">Date (newest)</a>
                            <a class="dropdown-item sort-by-dropdown date-o" href="./tag/">Date (oldest)</a>
                            <a class="dropdown-item sort-by-dropdown comm-m" href="./tag/">Most commented</a>
                            <a class="dropdown-item sort-by-dropdown comm-l" href="./tag/">Least commented</a>
                        </div>
                    </div>

                    <div class="float-right btn-group mr-2">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2">{{ selectedTagName }}</span>
                        </button>
                        <div class="dropdown-menu">
                        {{ #tags }}
                            <a class="dropdown-item tag-selector" href="./?tag={{ slug }}">{{ name }}</a>
                        {{ /tags }}
                        </div>
                    </div>

                    <div class="float-right btn-group mr-2">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2" id="number-of-articles">10 Articles</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item articles-per-page" articles-count="5">5 Articles</a>
                            <a class="dropdown-item articles-per-page" articles-count="10">10 Articles</a>
                            <a class="dropdown-item articles-per-page" articles-count="25">25 Articles</a>
                        </div>
                    </div>
                    
                    <h2 class="text-dark mb-0"><b>Sort articles by tags</b></h2>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                {{ #articles }}
                    <div class="card border border-dark mt-4 col-12">
                        <div class="card-body">
                            <a href="../article/?id={{ id }}#comments-anchor"><h6 class="float-right text-warning">{{ commentsLength }} comments</h6 class="float-right"></a>
                            <a class="text-decoration-none" href="../article/?id={{ id }}"><h5 class="card-title mb-0 text-warning">{{ title }}</h5></a>
                            <p class="mb-3">{{ date }}</p>
                            <p class="card-text mb-1">{{ summary }}</p>

                            {{ #tags }}
                                <a class="text-warning text-decoration-none pr-2" href="../tag/?tag={{ . }}"><b>{{ . }}</b></a>
                            {{ /tags }}

                            <div>
                                <div class='float-left pr-3'>
                                    <a href="../author/?id={{ authorId }}"><img class="rounded-circle border border-warning img-border mt-3" style="width: 64px; height: 64px" src="{{ author.avatar }}"></a>
                                </div>
                                <div class="float-left ">
                                    <h6 class="card-subtitle mt-4 text-muted">Author:</h6>
                                    <a class="text-warning text-decoration-none h-25 d-inline-block" href="../author/?id={{ authorId }}"><h4>{{ author.name }}</h4></a> 
                                </div>
                                <a href="../article/?id={{ id }}" class="float-right btn btn-warning mt-5">Read article</a>
                            </div>
                        </div>
                    </div>
                {{ /articles }}
            </div>
        </div>

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
    </main>
`;

  //  Pagination
  let currentPage = 0;
  let ITEMS_PER_PAGE = 10;
  let TOTAL_PAGES = Math.ceil(articles.length / ITEMS_PER_PAGE);
  function calculateTotalPages() {
    TOTAL_PAGES = Math.ceil(articles.length / ITEMS_PER_PAGE);
  }
  calculateTotalPages();

  const updateHTML = () => {
    document.getElementById("tags").innerHTML = Mustache.render(tagsTpl, {
      authors: authors,
      articles: articles.slice(
        currentPage * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE * (currentPage + 1)
      ),
      pages: getPages(TOTAL_PAGES, currentPage),
      previousNext: paginationNvg(TOTAL_PAGES, currentPage),
      selectedTagName: selectedTagName,
      tags: Object.keys(tags).map((slug) => {
        return {
          slug: slug,
          name: tags[slug],
        };
      }),
    });
  };
  updateHTML();

  //  Adding event listeners to the tagsTpl
  const tagMain = document.getElementById("tags");

  tagMain.addEventListener("click", (event) => {
    if (event.target.matches("a.prev-next")) {
      if (event.target.getAttribute("prev-next") === "minus") {
        currentPage--;
        updateHTML();
      } else {
        currentPage++;
        updateHTML();
      }
    } else if (event.target.matches("a.page-number")) {
      currentPage = event.target.getAttribute("data-page") * 1;
      updateHTML();
    } else if (event.target.matches(".sort-by-dropdown")) {
      event.preventDefault();
      if (event.target.matches(".date-n")) {
        currentPage = 0;
        sortBy(articles, "date", "asc");
        currentSorting = event.target.innerHTML;
      } else if (event.target.matches(".date-o")) {
        currentPage = 0;
        ITEMS_PER_PAGE = 5;
        calculateTotalPages();
        sortBy(articles, "date", "desc");
        currentSorting = event.target.innerHTML;
      } else if (event.target.matches(".comm-m")) {
        currentPage = 0;
        sortBy(articles, "commentsLength", "asc");
        currentSorting = event.target.innerHTML;
      } else if (event.target.matches(".comm-l")) {
        currentPage = 0;
        sortBy(articles, "commentsLength", "desc");
        currentSorting = event.target.innerHTML;
      }
      updateHTML();
      document.getElementById("current-sorting").innerHTML = currentSorting;
    } else if (event.target.matches(".articles-per-page")) {
      ITEMS_PER_PAGE = event.target.getAttribute("articles-count");
      calculateTotalPages();
      updateHTML();
      document.getElementById("number-of-articles").innerHTML =
        event.target.innerHTML;
    }
  });
};
tagsTempalte();
