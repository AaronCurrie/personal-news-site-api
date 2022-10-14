

\c nc_news_test
SELECT articles.*, COUNT(comments.article_id) ::INT AS comment_count
DECLARE @MaxTable FLOAT = COUNT(*) from articles
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY article_id DESC
OFFSET 0 ROWS FETCH NEXT 4 ROWS ONLY;