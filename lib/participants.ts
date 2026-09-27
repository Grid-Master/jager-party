/**
 * Участники группы.
 * Строка — username без @.
 * Объект — человек без username: нужен числовой id из Telegram.
 */
export type Participant =
  | string
  | {
      id: number;
      name: string;
    };

export const PARTICIPANTS: Participant[] = [
  "vladislav_bogorosh",
  "shagan_V",
  "Dcp529",
  "VvvWww33544",
  "alexandrakondratyuk",
  "v_dishka",
  "mr_melendi",
  "pushkareva_dar",
  "kinpatsuchan",
  "KRISMOTRUK",
  "LenaaAlena1",
  "ivanaleniin",
  "ssalantan",
  "vidsheff",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function groupMentions() {
  const seen = new Set<string>();
  const mentions: string[] = [];

  for (const participant of PARTICIPANTS) {
    if (typeof participant === "string") {
      const name = participant.trim().replace(/^@/, "");
      if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(name)) continue;

      const key = `u:${name.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      mentions.push(`@${name}`);
      continue;
    }

    if (!Number.isInteger(participant.id) || participant.id <= 0) continue;

    const key = `id:${participant.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    mentions.push(
      `<a href="tg://user?id=${participant.id}">${escapeHtml(participant.name)}</a>`,
    );
  }

  return mentions;
}
