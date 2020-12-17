const articlesTempalte = async () => {
  const articles = await getArticles();
  let currentSorting;
  sortBy(articles, "date", "asc");

  const articleTpl = `
    <main>
        <div class="bg-warning">
            <div class="container">
                <div class="pt-4 pb-4">

                    <div class="float-right btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2" id="current-sorting">Date (newest)</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item sort-by-dropdown date-n" href="./">Date (newest)</a>
                            <a class="dropdown-item sort-by-dropdown date-o" href="./">Date (oldest)</a>
                            <a class="dropdown-item sort-by-dropdown comm-m" href="./">Most commented</a>
                            <a class="dropdown-item sort-by-dropdown comm-l" href="./">Least commented</a>
                        </div>
                    </div>                    
                    <h2 class="text-dark mb-0"><b>Sort articles</b></h2>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                {{ #articles }}
                    <div class="card border border-dark mt-4 col-12">
                        <div class="card-body">
                            <a href="./article/?id={{ id }}#comments-anchor">
                              <h6 class="float-right text-warning">{{ commentsLength }} comments</h6>
                            </a>
                            <a class="text-warning text-decoration-none" href="./article/?id={{ id }}">
                                <h5>{{ title }}</h5>
                            </a>
                            <p class="mb-3">{{ date }}</p>
                            <p class="card-text mb-1">{{ summary }}</p>

                            {{ #tags }}
                                <a class="text-warning text-decoration-none pr-2" href="./tag/?tag={{ . }}"><b>{{ . }}</b></a>
                            {{ /tags }}

                            <div>
                                <div class='float-left pr-3'>
                                    <a href="./author/?id={{ authorId }}"><img class="rounded-circle border border-warning img-border mt-3" style="width: 64px; height: 64px" src="{{ author.avatar }}"></a>
                                </div>
                                <div class="float-left ">
                                    <h6 class="card-subtitle mt-4 text-muted">Author:</h6>
                                    <a class="text-warning text-decoration-none h-25 d-inline-block" href="./author/?id={{ authorId }}"><h4>{{ author.name }}</h4></a> 
                                </div>
                                <a href="./article/?id={{ id }}" class="float-right btn btn-warning mt-5">Read article</a>
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

  let currentPage = 0;
  let ITEMS_PER_PAGE = 10;
  const TOTAL_PAGES = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const updateHTML = () => {
    document.getElementById("root").innerHTML = Mustache.render(articleTpl, {
      articles: articles.slice(
        currentPage * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE * (currentPage + 1)
      ),
      pages: getPages(TOTAL_PAGES, currentPage),
      previousNext: paginationNvg(TOTAL_PAGES, currentPage),
    });
  };
  updateHTML();

  //  Adding event listeners to the tagsTpl
  const tagMain = document.getElementById("root");
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
      document.getElementById("current-sorting").innerHTML;
      event.preventDefault();
      if (event.target.matches(".date-n")) {
        currentPage = 0;
        sortBy(articles, "date", "asc");
        currentSorting = event.target.innerHTML;
      } else if (event.target.matches(".date-o")) {
        currentPage = 0;
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
    }
  });
};
articlesTempalte();
