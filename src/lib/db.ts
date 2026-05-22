import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const cards = [
  ["card_01", "晨霧", "先慢下來，看清楚真正讓你在意的是什麼。", "暫時不要急著下結論，給自己一點緩衝。", "self_doubt"],
  ["card_02", "小徑", "一步一步走，方向會在行動中變得清楚。", "你可能把終點想得太重，忽略了今天能做的小步。", "career"],
  ["card_03", "溫水", "照顧情緒，不代表你不夠堅強。", "你需要的也許不是答案，而是一段安全的停靠。", "stress"],
  ["card_04", "窗光", "把話說清楚之前，先確認自己的感受。", "別急著迎合對方，先聽見你自己的需要。", "relationship"],
  ["card_05", "靜夜", "睡前把未完成的事放到明天，不必在今晚全部解決。", "焦慮可能正在把小事放大，先讓身體回到現在。", "sleep"],
  ["card_06", "石階", "穩定比速度更重要，今天先完成一件小事。", "你不需要一次證明全部，只要讓自己重新站穩。", "stress"],
  ["card_07", "紙船", "有些擔心可以被寫下來，而不是一直放在心裡漂。", "試著分辨哪些是事實，哪些只是腦中的預演。", "self_doubt"],
  ["card_08", "暖燈", "關係裡的安心，常常來自被好好理解。", "先不要猜測對方的全部動機，回到可溝通的事。", "relationship"],
  ["card_09", "淺草", "你正在恢復，只是速度比想像中安靜。", "別用最疲憊的時候評價自己整個人生。", "stress"],
  ["card_10", "風鈴", "你的感受需要出口，也需要界線。", "說出需求時，可以溫和，但不必把自己縮小。", "relationship"],
  ["card_11", "種子", "迷惘不是停滯，而是還在等待新的整理。", "先選一個可嘗試的方向，不必立刻選定一生。", "career"],
  ["card_12", "茶盞", "把注意力帶回一件能掌握的小事。", "現在不適合逼自己做重大決定，先照顧穩定感。", "stress"],
  ["card_13", "書籤", "你可以暫停，不代表故事已經結束。", "休息不是落後，而是在幫自己保留繼續的力氣。", "sleep"],
  ["card_14", "花影", "敏感讓你接收到很多，也需要更清楚地保護自己。", "不是每一種情緒都需要立刻被解釋或處理。", "self_doubt"],
  ["card_15", "遠山", "長期的方向可以先模糊，今天的選擇要清楚。", "把大問題拆成小問題，壓力會比較能被承接。", "career"],
  ["card_16", "月台", "等待也可以是一種整理，而不是被困住。", "你可以問自己：我是在等時機，還是在躲害怕？", "self_doubt"],
  ["card_17", "柔枝", "關係需要彈性，也需要不失去自己。", "如果一直委屈，溫柔就會變成消耗。", "relationship"],
  ["card_18", "白石", "回到最基本的節奏：吃飯、喝水、睡覺、呼吸。", "當心很亂時，先照顧身體會比想通一切更有用。", "sleep"],
  ["card_19", "雨後", "情緒過去後，你會更看見自己真正需要什麼。", "今天的低落不是全部，它只是提醒你需要被照顧。", "stress"],
  ["card_20", "指南針", "方向感不是突然出現，而是從每次選擇累積。", "先用一週測試，不用把每個決定都做成永遠。", "career"],
];

function getSqlitePath() {
  if (process.env.SQLITE_PATH) {
    return process.env.SQLITE_PATH;
  }

  return process.env.VERCEL ? "/tmp/soul-oasis.db" : "prisma/dev.db";
}

function ensureSqliteDatabase(url: string) {
  const sqlite = new Database(url);

  sqlite.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      plan_type TEXT NOT NULL DEFAULT 'free',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      upright_meaning TEXT NOT NULL,
      reversed_meaning TEXT NOT NULL,
      category_hint TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT,
      guest_token TEXT,
      mode TEXT NOT NULL,
      category TEXT NOT NULL,
      user_input TEXT NOT NULL DEFAULT '',
      mood_score INTEGER,
      card_id TEXT,
      response_title TEXT NOT NULL,
      response_empathy TEXT NOT NULL,
      response_reflection TEXT NOT NULL,
      response_action TEXT NOT NULL,
      safety_flag BOOLEAN NOT NULL DEFAULT false,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT sessions_card_id_fkey FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS sessions_user_id_created_at_idx ON sessions(user_id, created_at);
    CREATE INDEX IF NOT EXISTS sessions_guest_token_idx ON sessions(guest_token);

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT NOT NULL PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      safety_flag BOOLEAN NOT NULL DEFAULT false,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS chat_messages_session_id_created_at_idx ON chat_messages(session_id, created_at);

    CREATE TABLE IF NOT EXISTS usage_limits (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT,
      guest_token TEXT,
      date TEXT NOT NULL,
      message_count INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT usage_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS usage_limits_user_id_date_idx ON usage_limits(user_id, date);
    CREATE INDEX IF NOT EXISTS usage_limits_guest_token_date_idx ON usage_limits(guest_token, date);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at DATETIME NOT NULL,
      expires_at DATETIME,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS subscriptions_user_id_status_idx ON subscriptions(user_id, status);

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT,
      session_id TEXT NOT NULL,
      message_id TEXT,
      rating INTEGER NOT NULL,
      reason TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT feedback_message_id_fkey FOREIGN KEY (message_id) REFERENCES chat_messages (id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS feedback_session_id_created_at_idx ON feedback(session_id, created_at);
    CREATE INDEX IF NOT EXISTS feedback_message_id_idx ON feedback(message_id);
  `);

  const ensureColumn = (table: string, column: string, definition: string) => {
    const columns = sqlite.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!columns.some((item) => item.name === column)) {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
    }
  };

  ensureColumn("sessions", "safety_flag", "safety_flag BOOLEAN NOT NULL DEFAULT false");
  ensureColumn("chat_messages", "safety_flag", "safety_flag BOOLEAN NOT NULL DEFAULT false");

  const insert = sqlite.prepare(`
    INSERT INTO cards (id, name, upright_meaning, reversed_meaning, category_hint)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      upright_meaning = excluded.upright_meaning,
      reversed_meaning = excluded.reversed_meaning,
      category_hint = excluded.category_hint
  `);

  for (const card of cards) {
    insert.run(...card);
  }

  sqlite.close();
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    const url = getSqlitePath();
    ensureSqliteDatabase(url);
    const adapter = new PrismaBetterSqlite3({ url });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
