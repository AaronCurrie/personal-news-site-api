

\c nc_news_test
    INSERT INTO articles (body, author, title, topic) 
    VALUES ('hello', 'butter_bridge', 'power', 'cats');
    SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = (SELECT MAX(articles.article_id) FROM articles)
    GROUP BY articles.article_id