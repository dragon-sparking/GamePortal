const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

// --- 設定 ---
const MAX_SCORE = 100; // 210から100に変更

const mangaList = [
    { id: 1, title: "BLEACH", firstImg: "comic/ble_1.jpg", lastImg: "comic/ble_74.jpg", points: 74 },
    { id: 2, title: "NARUTO", firstImg: "comic/nar_1.jpg", lastImg: "comic/nar_72.jpg", points: 72 },
    { id: 3, title: "BORUTO", firstImg: "comic/boruto_1.jpg", lastImg: "comic/boruto_20.jpg", points: 20 },
    { id: 4, title: "鬼滅の刃", firstImg: "comic/kim_1.jpg", lastImg: "comic/kim_23.jpg", points: 23 },
    { id: 5, title: "僕のヒーローアカデミア", firstImg: "comic/hero_1.jpg", lastImg: "comic/hero_42.jpg", points: 42 },
    { id: 6, title: "HUNTER×HUNTER", firstImg: "comic/hunter_1.jpg", lastImg: "comic/hunter_38.jpg", points: 38 },
    { id: 7, title: "ドラゴンボール超", firstImg: "comic/super_1.jpg", lastImg: "comic/super_24.jpg", points: 24 },
    { id: 8, title: "ジョジョリオン", firstImg: "comic/jojo_1.jpg", lastImg: "comic/jojo_27.jpg", points: 27 },
    { id: 9, title: "チェンソーマン", firstImg: "comic/chain_1.jpg", lastImg: "comic/chain_23.jpg", points: 23 },
    { id: 10, title: "チェンソーマン", firstImg: "comic/juju_1.jpg", lastImg: "comic/juju_30.jpg", points: 30 },
    { id: 11, title: "ブラッククローバー", firstImg: "comic/bc_1.jpg", lastImg: "comic/bc_37.jpg", points: 37 },
    { id: 12, title: "ワールドトリガー", firstImg: "comic/wt_1.jpg", lastImg: "comic/wt_29.jpg", points: 29 },
    { id: 13, title: "アンデッドアンラック", firstImg: "comic/und_1.jpg", lastImg: "comic/und_27.jpg", points: 27 },
    { id: 14, title: "Dr.STONE", firstImg: "comic/stone_1.jpg", lastImg: "comic/stone_27.jpg", points: 27 },
    { id: 15, title: "食戟のソーマ", firstImg: "comic/soma_1.jpg", lastImg: "comic/soma_36.jpg", points: 36 },
    { id: 16, title: "SAKAMOTO DAYS", firstImg: "comic/sakamoto_1.jpg", lastImg: "comic/sakamoto_27.jpg", points: 27 },
    { id: 17, title: "家庭教師ヒットマンREBORN!", firstImg: "comic/kate_1.jpg", lastImg: "comic/kate_42.jpg", points: 42 },
    { id: 18, title: "ドラゴンクエスト ダイの大冒険 勇者アバンと獄炎の魔王", firstImg: "comic/aban_1.jpg", lastImg: "comic/aban_15.jpg", points: 15 },
    { id: 19, title: "暗殺教室", firstImg: "comic/ansatu_1.jpg", lastImg: "comic/ansatu_21.jpg", points: 21 },
    { id: 20, title: "逃げ上手の若君", firstImg: "comic/nige_1.jpg", lastImg: "comic/nige_25.jpg", points: 25 },
    { id: 21, title: "地獄先生ぬ〜べ〜", firstImg: "comic/nube_1.jpg", lastImg: "comic/nube_20.jpg", points: 20 },
    { id: 22, title: "SKET DANCE", firstImg: "comic/sket_1.jpg", lastImg: "comic/sket_32.jpg", points: 32 },
    { id: 23, title: "ウィッチウォッチ", firstImg: "comic/witch_1.jpg", lastImg: "comic/witch_25.jpg", points: 25 },
    { id: 24, title: "テニスの王子様", firstImg: "comic/tenis_1.jpg", lastImg: "comic/tenis_42.jpg", points: 42 },
    { id: 25, title: "新テニスの王子様", firstImg: "comic/shinteni_1.jpg", lastImg: "comic/shinteni_46.jpg", points: 46 },
    { id: 26, title: "黒子のバスケ", firstImg: "comic/kuroko_1.jpg", lastImg: "comic/kuroko_30.jpg", points: 30 },
    { id: 27, title: "ハイキュー!!", firstImg: "comic/haikyu_1.jpg", lastImg: "comic/haikyu_45.jpg", points: 45 },
    { id: 28, title: "アイシールド21", firstImg: "comic/21_1.jpg", lastImg: "comic/21_37.jpg", points: 37 },
    { id: 29, title: "ダンダダン", firstImg: "comic/dan_1.jpg", lastImg: "comic/dan_23.jpg", points: 23 },
    { id: 30, title: "怪獣8号", firstImg: "comic/kaiju_1.jpg", lastImg: "comic/kaiju_16.jpg", points: 16 },
    { id: 31, title: "血界戦線", firstImg: "comic/kekkai_1.jpg", lastImg: "comic/kekkai_10.jpg", points: 10 },
    { id: 32, title: "SPY×FAMILY", firstImg: "comic/spy_1.jpg", lastImg: "comic/spy_17.jpg", points: 17 },
    { id: 33, title: "終わりのセラフ", firstImg: "comic/serafu_1.jpg", lastImg: "comic/serafu_36.jpg", points: 36 },
    { id: 34, title: "サマータイムレンダ", firstImg: "comic/renda_1.jpg", lastImg: "comic/renda_13.jpg", points: 13 },
    { id: 35, title: "SHAMAN KING", firstImg: "comic/shaman_1.jpg", lastImg: "comic/shaman_35.jpg", points: 35 },
    { id: 36, title: "僕とロボコ", firstImg: "comic/roboko_1.jpg", lastImg: "comic/roboko_26.jpg", points: 26 },
    { id: 37, title: "ワンパンマン", firstImg: "comic/one_1.jpg", lastImg: "comic/one_36.jpg", points: 36 },
    { id: 38, title: "モブサイコ100", firstImg: "comic/mob_1.jpg", lastImg: "comic/mob_16.jpg", points: 16 },
    { id: 39, title: "キングダム", firstImg: "comic/king_1.jpg", lastImg: "comic/king_78.jpg", points: 78 },
    { id: 40, title: "LIAR GAME", firstImg: "comic/liar_1.jpg", lastImg: "comic/liar_19.jpg", points: 19 },
    { id: 41, title: "嘘喰い", firstImg: "comic/uso_1.jpg", lastImg: "comic/uso_49.jpg", points: 49 },
    { id: 42, title: "かぐや様は告らせたい", firstImg: "comic/kaguya_1.jpg", lastImg: "comic/kaguya_28.jpg", points: 28 },
    { id: 43, title: "【推しの子】", firstImg: "comic/oshi_1.jpg", lastImg: "comic/oshi_16.jpg", points: 16 },
    { id: 44, title: "ウマ娘 シンデレラグレイ", firstImg: "comic/uma_1.jpg", lastImg: "comic/uma_23.jpg", points: 23 },
    { id: 45, title: "ゴールデンカムイ", firstImg: "comic/gold_1.jpg", lastImg: "comic/gold_31.jpg", points: 31 },
    { id: 46, title: "ハチワンダイバー", firstImg: "comic/hati_1.jpg", lastImg: "comic/hati_35.jpg", points: 35 },
    { id: 47, title: "君のことが大大大大大好きな100人の彼女", firstImg: "comic/daidai_1.jpg", lastImg: "comic/daidai_25.jpg", points: 25 },
    { id: 48, title: "ドラえもん", firstImg: "comic/dora_1.jpg", lastImg: "comic/dora_45.jpg", points: 45 },
    { id: 49, title: "クレヨンしんちゃん", firstImg: "comic/kuresin_1.jpg", lastImg: "comic/kuresin_50.jpg", points: 50 },
    { id: 50, title: "ちびまる子ちゃん", firstImg: "comic/maruko_1.jpg", lastImg: "comic/maruko_18.jpg", points: 18 },
    { id: 51, title: "サザエさん", firstImg: "comic/sazae_1.jpg", lastImg: "comic/sazae_68.jpg", points: 68 },
    { id: 52, title: "ラブひな", firstImg: "comic/love_1.jpg", lastImg: "comic/love_14.jpg", points: 14 },
    { id: 53, title: "魔法先生ネギま！", firstImg: "comic/negima_1.jpg", lastImg: "comic/negima_38.jpg", points: 38 },
    { id: 54, title: "UQ HOLDER!", firstImg: "comic/uq_1.jpg", lastImg: "comic/uq_28.jpg", points: 28 },
    { id: 55, title: "FAIRY TAIL", firstImg: "comic/fai_1.jpg", lastImg: "comic/fai_63.jpg", points: 63 },
    { id: 56, title: "FAIRY TAIL 100 YEARS QUEST", firstImg: "comic/fai100_1.jpg", lastImg: "comic/fai100_23.jpg", points: 23 },
    { id: 57, title: "EDENS ZERO", firstImg: "comic/eden_1.jpg", lastImg: "comic/eden_33.jpg", points: 33 },
    { id: 58, title: "炎炎ノ消防隊", firstImg: "comic/enen_1.jpg", lastImg: "comic/enen_34.jpg", points: 34 },
    { id: 59, title: "ブルーロック", firstImg: "comic/blue_1.jpg", lastImg: "comic/blue_38.jpg", points: 38 },
    { id: 60, title: "シャングリラフロンティア", firstImg: "comic/shan_1.jpg", lastImg: "comic/shan_26.jpg", points: 26 },
    { id: 61, title: "七つの大罪", firstImg: "comic/taizai_1.jpg", lastImg: "comic/taizai_41.jpg", points: 41 },
    { id: 62, title: "黙示録の四騎士", firstImg: "comic/mokushi_1.jpg", lastImg: "comic/mokushi_26.jpg", points: 26 },
    { id: 63, title: "東京卍リベンジャーズ", firstImg: "comic/manji_1.jpg", lastImg: "comic/manji_31.jpg", points: 31 },
    { id: 64, title: "彼女、お借りします", firstImg: "comic/kano_1.jpg", lastImg: "comic/kano_45.jpg", points: 45 },
    { id: 65, title: "五等分の花嫁", firstImg: "comic/goto_1.jpg", lastImg: "comic/goto_14.jpg", points: 14 },
    { id: 66, title: "化物語", firstImg: "comic/bake_1.jpg", lastImg: "comic/bake_22.jpg", points: 22 },
    { id: 67, title: "イジらないで、長瀞さん", firstImg: "comic/nagatoro_1.jpg", lastImg: "comic/nagatoro_20.jpg", points: 20 },
    { id: 68, title: "WIND BREAKER", firstImg: "comic/wind_1.jpg", lastImg: "comic/wind_25.jpg", points: 25 },
    { id: 69, title: "不滅のあなたへ", firstImg: "comic/fumetu_1.jpg", lastImg: "comic/fumetu_25.jpg", points: 25 },
    { id: 70, title: "ガチアクタ", firstImg: "comic/gati_1.jpg", lastImg: "comic/gati_18.jpg", points: 18 },
    { id: 71, title: "彼岸島", firstImg: "comic/higan_1.jpg", lastImg: "comic/higan_33.jpg", points: 33 },
    { id: 72, title: "彼岸島 48日後…", firstImg: "comic/higan48_1.jpg", lastImg: "comic/higan48_53.jpg", points: 53 },
    { id: 73, title: "進撃の巨人", firstImg: "comic/sin_1.jpg", lastImg: "comic/sin_34.jpg", points: 34 },
    { id: 74, title: "犬夜叉", firstImg: "comic/inu_1.jpg", lastImg: "comic/inu_56.jpg", points: 56 },
    { id: 75, title: "ハヤテのごとく！", firstImg: "comic/hayate_1.jpg", lastImg: "comic/hayate_52.jpg", points: 52 },
    { id: 76, title: "トニカクカワイイ", firstImg: "comic/tonikaku_1.jpg", lastImg: "comic/tonikaku_35.jpg", points: 35 },
    { id: 77, title: "僕の心のヤバイやつ", firstImg: "comic/yaba_1.jpg", lastImg: "comic/yaba_13.jpg", points: 13 },
    { id: 78, title: "葬送のフリーレン", firstImg: "comic/sousou_1.jpg", lastImg: "comic/sousou_15.jpg", points: 15 },
    { id: 79, title: "古見さんは、コミュ症です。", firstImg: "comic/komi_1.jpg", lastImg: "comic/komi_37.jpg", points: 37 },
    { id: 80, title: "マギ", firstImg: "comic/magi_1.jpg", lastImg: "comic/magi_37.jpg", points: 37 },
    { id: 81, title: "よふかしのうた", firstImg: "comic/yofu_1.jpg", lastImg: "comic/yofu_20.jpg", points: 20 },
    { id: 82, title: "からかい上手の高木さん", firstImg: "comic/takagi_1.jpg", lastImg: "comic/takagi_20.jpg", points: 20 },
    { id: 83, title: "MAJOR 2nd", firstImg: "comic/mj2_1.jpg", lastImg: "comic/mj2_32.jpg", points: 32 },
    { id: 84, title: "烈火の炎", firstImg: "comic/rekka_1.jpg", lastImg: "comic/rekka_33.jpg", points: 33 },
    { id: 85, title: "絶対可憐チルドレン", firstImg: "comic/zettai_1.jpg", lastImg: "comic/zettai_63.jpg", points: 63 },
    { id: 86, title: "SHY", firstImg: "comic/shy_1.jpg", lastImg: "comic/shy_33.jpg", points: 33 },
    { id: 87, title: "刃牙道", firstImg: "comic/bakido_1.jpg", lastImg: "comic/bakido_22.jpg", points: 22 },
    { id: 88, title: "バキ道", firstImg: "comic/bakidou_1.jpg", lastImg: "comic/bakidou_17.jpg", points: 17 },
    { id: 89, title: "魔入りました!入間くん", firstImg: "comic/iruma_1.jpg", lastImg: "comic/iruma_48.jpg", points: 48 },
    { id: 90, title: "浦安鉄筋家族", firstImg: "comic/ura_1.jpg", lastImg: "comic/ura_32.jpg", points: 31 },
    { id: 91, title: "鉄鍋のジャン", firstImg: "comic/jan_1.jpg", lastImg: "comic/jan_13.jpg", points: 13 },
    { id: 92, title: "桃源暗鬼", firstImg: "comic/tougen_1.jpg", lastImg: "comic/tougen_29.jpg", points: 29 },
    { id: 93, title: "釣りキチ三平", firstImg: "comic/tsuri_1.jpg", lastImg: "comic/tsuri_65.jpg", points: 65 },
    { id: 94, title: "鋼の錬金術師", firstImg: "comic/hag_1.jpg", lastImg: "comic/hag_27.jpg", points: 27 },
    { id: 95, title: "とある魔術の禁書目録", firstImg: "comic/toarum_1.jpg", lastImg: "comic/toarum_33.jpg", points: 33 },
    { id: 96, title: "とある科学の超電磁砲", firstImg: "comic/toaruk_1.jpg", lastImg: "comic/toaruk_20.jpg", points: 20 },
    { id: 97, title: "地縛少年花子くん", firstImg: "comic/hanako_1.jpg", lastImg: "comic/hanako_25.jpg", points: 25},
    { id: 98, title: "Fate/stay night", firstImg: "comic/fate_1.jpg", lastImg: "comic/fate_20.jpg", points: 20 },
    { id: 99, title: "Fate/stay night [Unlimited Blade Works]", firstImg: "comic/fateu_1.jpg", lastImg: "comic/fateu_8.jpg", points: 8 },
    { id: 100, title: "Fate/stay night [Heaven's Feel]", firstImg: "comic/fateh_1.jpg", lastImg: "comic/fateh_11.jpg", points: 11 },
    { id: 101, title: "アカギ", firstImg: "comic/akagi_1.jpg", lastImg: "comic/akagi_36.jpg", points: 36 },
    { id: 102, title: "賭博黙示録カイジ", firstImg: "comic/kaiji_1.jpg", lastImg: "comic/kaiji_13.jpg", points: 13 },
    { id: 103, title: "キルミーベイベー", firstImg: "comic/kill_1.jpg", lastImg: "comic/kill_16.jpg", points: 16 },
    { id: 104, title: "ひだまりスケッチ", firstImg: "comic/hidamari_1.jpg", lastImg: "comic/hidamari_10.jpg", points: 10 },
    { id: 105, title: "ご注文はうさぎですか?", firstImg: "comic/goti_1.jpg", lastImg: "comic/goti_13.jpg", points: 13 },
    { id: 106, title: "ゆるキャン△", firstImg: "comic/yuru_1.jpg", lastImg: "comic/yuru_18.jpg", points: 18 },
    { id: 107, title: "ゆるゆり", firstImg: "comic/yuruyuri_1.jpg", lastImg: "comic/yuruyuri_24.jpg", points: 24 },
    { id: 108, title: "苺ましまろ", firstImg: "comic/itigo_1.jpg", lastImg: "comic/itigo_9.jpg", points: 9 },
    { id: 109, title: "日常", firstImg: "comic/nichi_1.jpg", lastImg: "comic/nichi_12.jpg", points: 12 },
    { id: 110, title: "CITY", firstImg: "comic/city_1.jpg", lastImg: "comic/city_15.jpg", points: 15 },
    { id: 111, title: "メイドインアビス", firstImg: "comic/aby_1.jpg", lastImg: "comic/aby_14.jpg", points: 14 },
    { id: 112, title: "あそびあそばせ", firstImg: "comic/aso_1.jpg", lastImg: "comic/aso_15.jpg", points: 15 },
    { id: 113, title: "ベルセルク", firstImg: "comic/ber_1.jpg", lastImg: "comic/ber_43.jpg", points: 43 },
    { id: 114, title: "文豪ストレイドッグス", firstImg: "comic/bungo_1.jpg", lastImg: "comic/bungo_28.jpg", points: 28 },
    { id: 115, title: "頭文字D", firstImg: "comic/d_1.jpg", lastImg: "comic/d_48.jpg", points: 48 },
    { id: 116, title: "出会って5秒でバトル", firstImg: "comic/deago_1.jpg", lastImg: "comic/deago_30.jpg", points: 30 },
    { id: 117, title: "ダンジョン飯", firstImg: "comic/dmeshi_1.jpg", lastImg: "comic/dmeshi_14.jpg", points: 14 },
    { id: 118, title: "野原ひろし 昼メシの流儀", firstImg: "comic/hirosi_1.jpg", lastImg: "comic/hirosi_14.jpg", points: 14 },
    { id: 119, title: "鬼灯の冷徹", firstImg: "comic/hozuki_1.jpg", lastImg: "comic/hozuki_31.jpg", points: 31 },
    { id: 120, title: "異種族レビュアーズ", firstImg: "comic/ishu_1.jpg", lastImg: "comic/ishu_11.jpg", points: 1 },
    { id: 121, title: "ケロロ軍曹", firstImg: "comic/kero_1.jpg", lastImg: "comic/kero_35.jpg", points: 35 },
    { id: 122, title: "君に届け", firstImg: "comic/kimi_1.jpg", lastImg: "comic/kimi_30.jpg", points: 30 },
    { id: 123, title: "小林さんちのメイドラゴン", firstImg: "comic/koba_1.jpg", lastImg: "comic/koba_19.jpg", points: 19 },
    { id: 124, title: "ラーメン大好き小泉さん", firstImg: "comic/koizumi_1.jpg", lastImg: "comic/koizumi_14.jpg", points: 14 },
    { id: 125, title: "メダリスト", firstImg: "comic/medal_1.jpg", lastImg: "comic/medal_14.jpg", points: 14 },
    { id: 126, title: "見える子ちゃん", firstImg: "comic/mieru_1.jpg", lastImg: "comic/mieru_14.jpg", points: 14 },
    { id: 127, title: "蟲師", firstImg: "comic/muchi_1.jpg", lastImg: "comic/muchi_10.jpg", points: 10 },
    { id: 128, title: "無職転生", firstImg: "comic/musho_1.jpg", lastImg: "comic/musho_24.jpg", points: 24 },
    { id: 129, title: "ながされて藍蘭島", firstImg: "comic/naga_1.jpg", lastImg: "comic/naga_44.jpg", points: 44 },
    { id: 130, title: "夏目友人帳", firstImg: "comic/natume_1.jpg", lastImg: "comic/natume_33.jpg", points: 33 },
    { id: 131, title: "悪役令嬢転生おじさん", firstImg: "comic/ojisan_1.jpg", lastImg: "comic/ojisan_10.jpg", points: 10 },
    { id: 132, title: "沖縄で好きになった子が方言すぎてツラすぎる", firstImg: "comic/okinawa_1.jpg", lastImg: "comic/okinawa_1.jpg", points: 11 },
    { id: 133, title: "王様ランキング", firstImg: "comic/ousama_1.jpg", lastImg: "comic/ousama_21.jpg", points: 21 },
    { id: 134, title: "ぷにるはかわいいスライム", firstImg: "comic/puni_1.jpg", lastImg: "comic/puni_10.jpg", points: 10 },
    { id: 135, title: "ロックは淑女の嗜みでして", firstImg: "comic/rock_1.jpg", lastImg: "comic/rock_8.jpg", points: 8 },
    { id: 136, title: "瑠璃の宝石", firstImg: "comic/ruri_1.jpg", lastImg: "comic/ruri_7.jpg", points: 7 },
    { id: 137, title: "はたらく細胞", firstImg: "comic/saibo_1.jpg", lastImg: "comic/saibo_6.jpg", points: 6 },
    { id: 138, title: "終末のワルキューレ", firstImg: "comic/shuma_1.jpg", lastImg: "comic/shuma_27.jpg", points: 27 },
    { id: 139, title: "その着せ替え人形は恋をする", firstImg: "comic/sono_1.jpg", lastImg: "comic/sono_15.jpg", points: 15 },
    { id: 140, title: "そらのおとしもの", firstImg: "comic/sora_1.jpg", lastImg: "comic/sora_20.jpg", points: 20 },
    { id: 141, title: "転生したらスライムだった件", firstImg: "comic/tensura_1.jpg", lastImg: "comic/tensura_31.jpg", points: 31 },
    { id: 142, title: "チ。", firstImg: "comic/ti_1.jpg", lastImg: "comic/ti_8.jpg", points: 8 },
    { id: 143, title: "ちはやふる", firstImg: "comic/tiha_1.jpg", lastImg: "comic/tiha_50.jpg", points: 50 },
    { id: 144, title: "TSUYOSHI 誰も勝てない、アイツには", firstImg: "comic/tsuyoshi_1.jpg", lastImg: "comic/tsuyoshi_30.jpg", points: 30 },
    { id: 145, title: "宇宙兄弟", firstImg: "comic/uchu_1.jpg", lastImg: "comic/uchu_45.jpg", points: 45 },
    { id: 146, title: "闇金ウシジマくん", firstImg: "comic/ushijima_1.jpg", lastImg: "comic/ushijima_46.jpg", points: 46 },
    { id: 147, title: "宇崎ちゃんは遊びたい!", firstImg: "comic/uza_1.jpg", lastImg: "comic/uza_14.jpg", points: 14 },
    { id: 148, title: "ヴィンランド・サガ", firstImg: "comic/vin_1.jpg", lastImg: "comic/vin_29.jpg", points: 29 },
    { id: 149, title: "幼女戦記", firstImg: "comic/youjo_1.jpg", lastImg: "comic/youjo_34.jpg", points: 34 },
    { id: 150, title: "黒執事", firstImg: "comic/situji_1.jpg", lastImg: "comic/situji_35.jpg", points: 35 },
];

let users = {}; 
let deck = mangaList.map(m => ({ ...m, selected: false }));
let gameState = 'waiting';
let turnOrder = [];
let currentTurnIndex = 0;
let roundCount = 0;

// 全リセット関数
function resetFullGame() {
    console.log("プレイヤーが不在のためゲームを初期化しました。");
    users = {};
    deck = mangaList.map(m => ({ ...m, selected: false }));
    gameState = 'waiting';
    turnOrder = [];
    currentTurnIndex = 0;
    roundCount = 0;
}

io.on('connection', (socket) => {
    socket.emit('init-game', { deck, gameState, maxScore: MAX_SCORE });

    socket.on('join-game', (userName) => {
        let existingUserKey = Object.keys(users).find(key => users[key].name === userName);
        if (existingUserKey) {
            users[socket.id] = users[existingUserKey];
            delete users[existingUserKey];
            users[socket.id].id = socket.id;
            turnOrder = turnOrder.map(id => id === existingUserKey ? socket.id : id);
        } else {
            users[socket.id] = {
                id: socket.id, name: userName, score: 0, totalWinPoint: 0,
                ready: false, isStand: false, status: 'playing'
            };
        }
        sendUpdateList();
    });

    socket.on('player-ready', () => {
        if (!users[socket.id]) return;
        users[socket.id].ready = true;
        const userArray = Object.values(users);
        if (userArray.every(u => u.ready) && userArray.length >= 2) {
            startNextRound();
        } else {
            sendUpdateList();
        }
    });

    function startNextRound() {
        gameState = 'playing';
        roundCount++;
        Object.values(users).forEach(u => {
            u.score = 0; u.isStand = false; u.status = 'playing'; u.ready = false; 
        });
        turnOrder = (roundCount === 1) 
            ? Object.keys(users).sort(() => Math.random() - 0.5)
            : Object.keys(users).sort((a, b) => users[a].totalWinPoint - users[b].totalWinPoint);
        
        currentTurnIndex = 0;
        io.emit('round-started', { deck, turnOrder, currentTurn: turnOrder[currentTurnIndex], roundCount });
        sendUpdateList();
    }

    socket.on('select-manga', (mangaId) => {
        if (gameState !== 'playing' || turnOrder[currentTurnIndex] !== socket.id) return;
        const manga = deck.find(m => m.id === mangaId);
        if (!manga || manga.selected) return;

        manga.selected = true;
        const user = users[socket.id];
        user.score += manga.points;

        if (user.score > MAX_SCORE) {
            user.status = 'burst';
            user.isStand = true;
        }

        io.emit('manga-selected', {
            userId: socket.id, userName: user.name, manga, 
            newScore: user.score, updatedDeck: deck, isBurst: user.status === 'burst'
        });

        if (deck.filter(m => !m.selected).length === 0) endGame(true);
        else nextTurn();
    });

    socket.on('player-stand', () => {
        if (gameState !== 'playing' || turnOrder[currentTurnIndex] !== socket.id) return;
        users[socket.id].isStand = true;
        nextTurn();
    });

    function nextTurn() {
        let attempts = 0;
        const total = turnOrder.length;
        while (attempts < total) {
            currentTurnIndex = (currentTurnIndex + 1) % total;
            const nextId = turnOrder[currentTurnIndex];
            if (users[nextId] && !users[nextId].isStand) {
                io.emit('turn-update', { currentTurn: nextId });
                sendUpdateList();
                return;
            }
            attempts++;
        }
        endGame(false);
    }

    function endGame(isFinal) {
        gameState = 'waiting';
        const roundResults = Object.values(users).sort((a, b) => {
            if (a.status === 'burst' && b.status !== 'burst') return 1;
            if (a.status !== 'burst' && b.status === 'burst') return -1;
            return b.score - a.score;
        });

        roundResults.forEach((u, index) => {
            let winP = (u.status === 'burst') ? 0 : Math.max(3 - index, 0);
            users[u.id].totalWinPoint += winP;
            u.currentWinPoint = winP;
        });

        io.emit('round-over', roundResults);
        if (isFinal) {
            io.emit('final-game-over', Object.values(users).sort((a, b) => b.totalWinPoint - a.totalWinPoint));
            deck = mangaList.map(m => ({ ...m, selected: false }));
            roundCount = 0; 
        }
        sendUpdateList();
    }

    function sendUpdateList() {
        io.emit('update-user-list', Object.values(users).map(u => ({
            ...u, active: (gameState === 'playing' && turnOrder[currentTurnIndex] === u.id)
        })));
    }

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            delete users[socket.id];
            if (Object.keys(users).length === 0) resetFullGame();
            else sendUpdateList();
        }
    });
});

http.listen(3000, () => console.log('Server running on port 3000'));