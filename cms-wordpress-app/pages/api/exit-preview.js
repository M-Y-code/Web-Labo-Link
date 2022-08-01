export default async function exit(_, res) {
  // 現在のユーザーを「プレビュー モード」から終了します。 この関数は引数を受け入れません。
  res.clearPreviewData();

  // ユーザーをインデックス ページにリダイレクトします。
  res.writeHead(307, { Location: "/" });
  res.end();
}
