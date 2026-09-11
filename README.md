# おえかき・ぬりえ

小さな子どもが、ブラウザで自由におえかきやぬりえを楽しめるReactアプリです。

## あそびかた

- **ぬりえ** — テーマ、絵の順に選び、色・バケツ・ペン・ブラシ・けしゴムでぬります。途中の色はブラウザに保存されます。
- **おえかき** — 白紙のキャンバスに、ペン・ブラシ・けしゴムで自由に描きます。

すべてのホーム以外の画面には、左上に一段前へ戻る `← もどる` ボタンがあります。

## レイアウト

- **横画面**: キャンバスを中央、色を右の3列レール、道具を下部に表示します。
- **縦画面**: キャンバスを優先し、色と道具を下部に横並びで表示します。

## 開発

```bash
npm install
npm run dev
```

品質確認:

```bash
npm run build
npm run lint
```

視覚・操作確認には `work/verify-navigation-ui.cjs` を使います。ローカルサーバーを起動したうえで、次のように実行します。

```bash
BASE=http://127.0.0.1:4173/drawing/ NODE_PATH="$(npm root -g)" node work/verify-navigation-ui.cjs
```

この検証は、iPhone縦・iPad縦・iPad横・デスクトップ幅で、画面遷移と横あふれを確認します。

## 技術

- React 18 / TypeScript / Vite
- HTML Canvas API
- GitHub Pages
