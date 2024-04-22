const postsContainer = document.getElementById('posts-container');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');

let currentPage = 1;
const postsPerPage = 10;

function fetchPosts() {
    Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/comments')
    ])
    .then(([postsResponse, commentsResponse]) => Promise.all([postsResponse.json(), commentsResponse.json()]))
    .then(([posts, comments]) => {
        displayPosts(posts, comments);
    })
    .catch(error => console.error('Ошибка:', error));
}

function displayPosts(posts, comments) {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    postsContainer.innerHTML = '';

    currentPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        const titleElement = document.createElement('h2');
        titleElement.classList.add('post-title');
        titleElement.textContent = post.title;

        const bodyElement = document.createElement('p');
        bodyElement.classList.add('post-body');
        bodyElement.textContent = post.body;

        const commentsElement = document.createElement('div');
        commentsElement.classList.add('comments');

        const postComments = comments.filter(comment => comment.postId === post.id).slice(0, 5);
        postComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `<strong>${comment.name}</strong>: ${comment.body}`;
            commentsElement.appendChild(commentElement);
        });

        const showCommentsBtn = document.createElement('button');
        showCommentsBtn.textContent = 'Показать комментарии';
        showCommentsBtn.addEventListener('click', () => {
            commentsElement.style.display = 'block';
            showCommentsBtn.style.display = 'none';
        });

        postElement.appendChild(titleElement);
        postElement.appendChild(bodyElement);
        postElement.appendChild(showCommentsBtn);
        postElement.appendChild(commentsElement);

        postsContainer.appendChild(postElement);
    });
}

function handlePageChange(page) {
    currentPage = page;
    currentPageSpan.textContent = currentPage;
    fetchPosts();
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        handlePageChange(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    handlePageChange(currentPage + 1);
});

fetchPosts();