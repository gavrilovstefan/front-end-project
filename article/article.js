const articleTemplate = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const article = await getArticleById(articleId);
    const author = await getAuthorById(article.authorId);
    const articleComments = await getCommentsByArticleId(articleId);
    let currentSorting;


    //  Sorts the articles by date
    function newestArt() {
        articleComments.sort(function (a, b) {    
            return new Date(b.date) - new Date(a.date)
        })
    } 
    function oldestArt() {
        articleComments.sort(function (a, b) {    
            return new Date(a.date) - new Date(b.date)
        })
    } 
    oldestArt()
    
    const articleTpl = `
    <main>
        <div class="bg-secondary pt-5 pb-5">
            <div class="container">
                {{ #author }}
                    <div class="media">
                        <div class="float-left pr-4">
                            <a class="text-warning text-decoration-none" href="../author/?id={{ id }}">
                                <img class="rounded-circle border border-warning img-border" src="{{ avatar }}">
                            </a>
                        </div>
                        <div class="media-body">
                            <h6 class="text-light mb-0">An article by:
                                <a class="text-warning text-decoration-none" href="../author/?id={{ id }}">
                                    <h3>{{ name }}</h3>
                                </a>
                            </h6>
                            <a class="text-warning text-decoration-none" href="../author/?id={{ id }}">
                                <h5>@{{ username }}</h5>
                            </a>
                            <a class="text-light text-decoration-none" href="mailto: {{ email }}"><i
                                class="fa fa-envelope pr-2"></i>{{ email }}</a>
                            <br>
                            <a class="text-light text-decoration-none" href="{{ website }}"><i
                                class="fa fa-globe pr-2"></i> {{ website }}</a>
                        </div>
                    </div>
                {{ /author }}
            </div>
        </div>

        {{ #article }}    
            <div class="bg-warning pb-3 pt-3">
                <div class="container">
                    <a class="text-secondary text-decoration-none" href="../article/?id={{ id }}">
                        <h2>{{ title }}</h2>
                    </a>
                    <p class="text-light mt-2 mb-0">{{ date }}</p>
                    {{ #tags }}
                        <a class="text-secondary text-decoration-none pr-2" href="../tag/?tag={{ . }}"><b>{{ . }}</b></a>
                    {{ /tags }}
                </div>
            </div>

            <div class="container">
                <p class="article-content">{{{ body }}}</p>
            </div>

            <div class="bg-warning">
                <div class="container">
                    <div class="pt-4 pb-4">
                        <div class="float-right btn-group">
                            <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split text-warning" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="pr-2" id="current-sorting">Date (oldest)</span>
                            </button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item sort-by-drop-down date-o">Date (oldest)</a>
                                <a class="dropdown-item sort-by-drop-down date-n">Date (newest)</a>
                            </div>
                        </div>
                        <h2 class="text-dark mb-0"><b>Article commnets</b></h2>
                    </div>
                </div>
            </div>
        {{ /article }}

        <div id="comments-anchor" class="container">
            {{ #comments }}
                <div class="media comment-card">
                    {{ #authorComments }}
                        <div class="float-left pr-4">
                            <a class="text-warning text-decoration-none" href="../author/?id={{ userId }}">
                                <img class="rounded-circle border border-warning img-border img-size" src="{{ avatar }}">
                        </div>
                    {{ /authorComments }}   
                    {{ ^authorComments }}
                        <div class="float-left pr-4">
                            <a class="text-warning text-decoration-none" href="../author/?id={{ userId }}">
                                <img class="rounded-circle border border-warning img-border img-size" src="https://iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png"></a>
                        </div>
                    {{ /authorComments }}
                    <div class="media-body">
                        {{ #authorComments }}
                            <h5 class="mb-0">{{ name }}</h5></a>
                        {{ /authorComments }} 
                        {{ ^authorComments }}
                            <h5 class="mb-0">Anonymous</h5>
                        {{ /authorComments }}  
                        <p class="mb-3">{{ date }}</p>
                        <p class="mb-0">{{{ body }}}</p>       
                    </div>
                </div>
            {{ /comments }}
        </div>
        

        <div class="container">
            <nav aria-label="users-pagination">
                <ul class="pagination justify-content-center mt-4">
                    {{ #previousNext }}
                        <li class="page-item {{ enableDisablePrev }}">
                            <a class="page-link prev-next" prev-next="minus" href="#" tabindex="-1" aria-disabled="true"><<</a>
                        </li>
                        {{ #pages }}
                            <li class="page-item {{ activeClass }}">
                                <a class="page-link page-number" data-page={{ dataPage }} href="#">{{ label }}</a>
                            </li>
                        {{ /pages }}
                        <li class="page-item {{ enableDisableNext }}">
                            <a class="page-link prev-next" prev-next="plus" href="#">>></a>
                        </li>
                    {{ /previousNext }}
                </ul>
            </nav>
        </div>
    </main>
    
`

    //  Change date format
    const changeDateFormat = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const year = article.date.substring(0, 4);
        let month = article.date.substring(5, 7);
        const day = article.date.substring(8, 10);
        month = monthNames[month - 1];
        article.date = day + ' ' + month + ' ' + year;

        articleComments.forEach(obj => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const year = obj.date.substring(0, 4);
            let month = obj.date.substring(5, 7);
            const day = obj.date.substring(8, 10);
            month = monthNames[month - 1];
            obj.date = day + ' ' + month + ' ' + year;
        });

        return article;
    }
    changeDateFormat();

    //  Pagination
    let currentPage = 0;
    const ITEMS_PER_PAGE = 3;
    const TOTAL_PAGES = Math.ceil(articleComments.length / ITEMS_PER_PAGE);

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
    
    const articleHTML = () => {
        document.getElementById('article').innerHTML = Mustache.render(articleTpl, {
            author: author,
            article: article,
            comments: articleComments.slice(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE * (currentPage + 1)),
            pages: getPages(currentPage),
            previousNext: paginationNvg(currentPage)
        });
    }
    articleHTML();

    //  Adding event listeners to the articleTpl
    const articleMain = document.getElementById('article');
    articleMain.addEventListener('click', (event) => {

        if (event.target.matches("a.prev-next")) {
            if (event.target.getAttribute('prev-next') === 'minus') {
                currentPage--;
                articleHTML()

            } else {
                currentPage++;
                articleHTML()
            }
            
        } else if (event.target.matches("a.page-number")) {
            currentPage = event.target.getAttribute('data-page') * 1;
            articleHTML();

        } else if (event.target.matches(".sort-by-drop-down")) {
            document.getElementById('current-sorting').innerHTML;
            event.preventDefault();
            
            if (event.target.matches(".date-n")) {
                currentPage = 0
                newestArt();
                currentSorting = event.target.innerHTML;

            } else if (event.target.matches(".date-o")) {
                currentPage = 0
                oldestArt();
                currentSorting = event.target.innerHTML;
            }
            articleHTML();
            document.getElementById('current-sorting').innerHTML = currentSorting;
        }
    });
}
articleTemplate();