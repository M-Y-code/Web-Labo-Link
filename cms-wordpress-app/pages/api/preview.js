import { getPreviewPost } from "../../lib/api";

export default async function preview(req, res) {
  const { secret, id, slug } = req.query;

  // シークレットと次のパラメータを確認してください
  // このシークレットは、この API ルートによってのみ知られる必要があります
  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET ||
    (!id && !slug)
  ) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // WordPress をフェッチして、提供された「id」または「slug」が存在するかどうかを確認します
  const post = await getPreviewPost(id || slug, id ? "DATABASE_ID" : "SLUG");

  // 投稿が存在しない場合、プレビュー モードが有効にならないようにする
  if (!post) {
    return res.status(401).json({ message: "Post not found" });
  }

  // Cookie を設定してプレビュー モードを有効にする
  res.setPreviewData({
    post: {
      id: post.databaseId,
      slug: post.slug,
      status: post.status,
    },
  });

  // 取得した投稿からパスにリダイレクト
  // オープン リダイレクトの脆弱性につながる可能性があるため、「req.query.slug」にはリダイレクトしません。
  res.writeHead(307, { Location: `/posts/${post.slug || post.databaseId}` });
  res.end();
}
