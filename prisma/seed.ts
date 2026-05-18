import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.SQLITE_PATH ?? "prisma/dev.db" }),
});

const cards = [
  ["晨霧", "先慢下來，看清楚真正讓你在意的是什麼。", "暫時不要急著下結論，給自己一點緩衝。", "self_doubt"],
  ["小徑", "一步一步走，方向會在行動中變得清楚。", "你可能把終點想得太重，忽略了今天能做的小步。", "career"],
  ["溫水", "照顧情緒，不代表你不夠堅強。", "你需要的也許不是答案，而是一段安全的停靠。", "stress"],
  ["窗光", "把話說清楚之前，先確認自己的感受。", "別急著迎合對方，先聽見你自己的需要。", "relationship"],
  ["靜夜", "睡前把未完成的事放到明天，不必在今晚全部解決。", "焦慮可能正在把小事放大，先讓身體回到現在。", "sleep"],
  ["石階", "穩定比速度更重要，今天先完成一件小事。", "你不需要一次證明全部，只要讓自己重新站穩。", "stress"],
  ["紙船", "有些擔心可以被寫下來，而不是一直放在心裡漂。", "試著分辨哪些是事實，哪些只是腦中的預演。", "self_doubt"],
  ["暖燈", "關係裡的安心，常常來自被好好理解。", "先不要猜測對方的全部動機，回到可溝通的事。", "relationship"],
  ["淺草", "你正在恢復，只是速度比想像中安靜。", "別用最疲憊的時候評價自己整個人生。", "stress"],
  ["風鈴", "你的感受需要出口，也需要界線。", "說出需求時，可以溫和，但不必把自己縮小。", "relationship"],
  ["種子", "迷惘不是停滯，而是還在等待新的整理。", "先選一個可嘗試的方向，不必立刻選定一生。", "career"],
  ["茶盞", "把注意力帶回一件能掌握的小事。", "現在不適合逼自己做重大決定，先照顧穩定感。", "stress"],
  ["書籤", "你可以暫停，不代表故事已經結束。", "休息不是落後，而是在幫自己保留繼續的力氣。", "sleep"],
  ["花影", "敏感讓你接收到很多，也需要更清楚地保護自己。", "不是每一種情緒都需要立刻被解釋或處理。", "self_doubt"],
  ["遠山", "長期的方向可以先模糊，今天的選擇要清楚。", "把大問題拆成小問題，壓力會比較能被承接。", "career"],
  ["月台", "等待也可以是一種整理，而不是被困住。", "你可以問自己：我是在等時機，還是在躲害怕？", "self_doubt"],
  ["柔枝", "關係需要彈性，也需要不失去自己。", "如果一直委屈，溫柔就會變成消耗。", "relationship"],
  ["白石", "回到最基本的節奏：吃飯、喝水、睡覺、呼吸。", "當心很亂時，先照顧身體會比想通一切更有用。", "sleep"],
  ["雨後", "情緒過去後，你會更看見自己真正需要什麼。", "今天的低落不是全部，它只是提醒你需要被照顧。", "stress"],
  ["指南針", "方向感不是突然出現，而是從每次選擇累積。", "先用一週測試，不用把每個決定都做成永遠。", "career"],
];

async function main() {
  for (const [name, uprightMeaning, reversedMeaning, categoryHint] of cards) {
    await prisma.card.upsert({
      where: { name },
      update: { uprightMeaning, reversedMeaning, categoryHint },
      create: { name, uprightMeaning, reversedMeaning, categoryHint },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
