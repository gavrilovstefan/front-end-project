const authorTempalte = async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');
    const selectedTagSlug = urlParams.get('tag');

    const articles = await getArticles();
    const tags = await getTags();
    const comments = await getComments();
    const author = await getAuthorById(authorId);
    let currentSorting;

    // Filter optimization
    let authorArticles = articles.filter(article => article.authorId === authorId); ;

    const authorTags = authorArticles.map(obj => obj.tags);
    let selectedTagName = 'All Tags';
    if (tags[selectedTagSlug]) {
        selectedTagName = tags[selectedTagSlug];    
        authorArticles = authorArticles.filter(article => article.tags.includes(selectedTagSlug))   
    } 

    let uniqueAuthorTags = [...new Set(authorTags.flat())].map(slug => {
        return {
            slug: slug,
            tagName: tags[slug]
        }
    });
    //console.log(uniqueAuthorTags)

    const commentsPerArticle = authorArticles.map(article => {
        let articleComments = comments.filter(obj => obj.articleId === article.id)
        return articleComments
        })
        for (let i = 0; i < authorArticles.length; i++) {
            authorArticles[i].commmentsLength = commentsPerArticle[i].length
    }

    //  Sorts the articles by date
    function newestArt() {
        authorArticles.sort(function (a, b) {    
            return new Date(b.date) - new Date(a.date)
        })
    } 
    newestArt()
    function oldestArt() {
        authorArticles.sort(function (a, b) {    
            return new Date(a.date) - new Date(b.date)
        })
    } 

    //  Sorts the articles by most commented articles
    function mostCommented() {
        authorArticles.sort(function (a, b){
            return b.commmentsLength - a.commmentsLength
        })
    } 
    function leastCommented() {
        authorArticles.sort(function (a, b){
            return a.commmentsLength - b.commmentsLength
        })
    } 

    const authorTpl = `
    {{ #author }}
    <main>
        <div class="bg-secondary pt-5 pb-4">
            <div class="container">
                <div class="float-left pr-4">
                    <img class="rounded-circle border border-warning img-border" src="{{ avatar }}">
                </div>
                <h1 class="text-light mt-0">{{ name }}</h1>
                <a class="text-warning text-decoration-none" href="./?id={{ id }}">
                <h6>@{{ username }}</h6>
                </a>
                <a class="text-light text-decoration-none" href="mailto: {{ email }}"><i
                    class="fa fa-envelope pr-2"></i>{{ email }}</a>
                <br>
                <a class="text-light text-decoration-none" href="{{ website }}"><i
                    class="fa fa-globe pr-2"></i> {{ website }}</a>
                <p class="m-bio">"{{ bio }}"</p>
            </div>
        </div>
        <div class="bg-warning">
            <div class="container">
                <div class="pt-4 pb-4">

                    <div class="float-right btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2" id="current-sorting">Date (newest)</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item sort-by-drop-down date-n">Date (newest)</a>
                            <a class="dropdown-item sort-by-drop-down date-o">Date (oldest)</a>
                            <a class="dropdown-item sort-by-drop-down comm-m">Most commented</a>
                            <a class="dropdown-item sort-by-drop-down comm-l">Least commented</a>
                        </div>
                    </div>

                    <div class="float-right btn-group mr-2">
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="pr-2">{{ selectedTagName }}</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="./?id={{ id }}">All Tags</a>
                            {{ #tags }}
                                <a class="dropdown-item" href="./?id={{ id }}&tag={{ slug }}">{{ tagName }}</a>
                            {{ /tags }}
                        </div>
                    </div>
                    
                    <div class="float-right btn-group mr-2">
                        <button type="button" class="btn btn-secondary text-warning">Articles per page</button>
                        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="./?id={{ id }}" value="3">3</a>
                            <a class="dropdown-item" href="./?id={{ id }}" value="5">5</a>
                            <a class="dropdown-item" href="./?id={{ id }}" value="7">7</a>
                        </div>
                    </div>

                    <h2 class="text-dark mb-0"><b>{{ name }} articles</b></h2>
                </div>
            </div>
        </div>
        <div class="container">
            {{ #authorArticles }}
                <div class="card border border-dark mt-4 col-12">
                    <div class="card-body">
                        <a href="../article/?id={{ id }}#comments-anchor"><h6 class="float-right text-warning">{{ commmentsLength }} comments</h6 class="float-right"></a>
                        <a class="text-warning text-decoration-none" href="../article/?id={{ id }}"><h5>{{ title }}</h5></a>
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
            {{ /authorArticles }}
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
    {{ /author }}
`

    //  Change date format
    const changeDateFormat = () => {
        return authorArticles.forEach(obj => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const year = obj.date.substring(0, 4);
            let month = obj.date.substring(5, 7);
            const day = obj.date.substring(8, 10);
            month = monthNames[month - 1];
            obj.date = day + ' ' + month + ' ' + year;
        })
    }
    changeDateFormat();

    //  Pagination
    let currentPage = 0;
    const ITEMS_PER_PAGE = 3;
    const TOTAL_PAGES = Math.ceil(authorArticles.length / ITEMS_PER_PAGE);

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
        if (TOTAL_PAGES > 1) {
            let buttonDisable = [{
                enableDisablePrev: currentPage === 0 ? 'disabled' : '',
                enableDisableNext: currentPage === (TOTAL_PAGES - 1) ? 'disabled' : ''
            }]
            return buttonDisable;
        }
    }
    paginationNvg(currentPage)

    const updateHTML = () => {
        document.getElementById('author').innerHTML = Mustache.render(authorTpl, {
            author: author,
            authorArticles: authorArticles.slice(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE * (currentPage + 1)),
            pages: getPages(currentPage),
            previousNext: paginationNvg(currentPage),
            selectedTagName: selectedTagName,
            tags: uniqueAuthorTags
        })
    }
    updateHTML()

    //  Adding event listeners to the authorTpl
    const authorMain = document.getElementById('author');
    authorMain.addEventListener('click', (event) => {

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
            updateHTML();

        } else if (event.target.matches(".sort-by-drop-down")) {
            document.getElementById('current-sorting').innerHTML;
            event.preventDefault();

            if (event.target.matches(".date-n")) {
                currentPage = 0;
                newestArt();
                currentSorting = event.target.innerHTML;
                
            } else if (event.target.matches(".date-o")) {
                currentPage = 0;
                oldestArt();
                currentSorting = event.target.innerHTML;

            } else if (event.target.matches(".comm-m")) {
                currentPage = 0;
                mostCommented();
                currentSorting = event.target.innerHTML;

            } else if (event.target.matches(".comm-l")) {
                currentPage = 0;
                leastCommented();
                currentSorting = event.target.innerHTML;
            }
            updateHTML()
            document.getElementById('current-sorting').innerHTML = currentSorting;
        }
    });
}
authorTempalte()