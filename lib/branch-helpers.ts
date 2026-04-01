import type { Branch } from "@/types/shaarei";

export function branchKey(b: Branch): string {
  return String(b.id ?? b._id ?? b.branchId ?? b.code ?? "");
}

const YERMIYAHU = "ירמיהו";

function branchSearchText(b: Branch): string {
  return [b.name, b.title, b.code].filter(Boolean).join(" ");
}

/** Branch whose name/title/code contains "ירמיהו" (Yermiyahu), if any. */
export function findYermiyahuBranchId(branches: Branch[]): string | null {
  for (const b of branches) {
    if (branchSearchText(b).includes(YERMIYAHU)) {
      const id = branchKey(b);
      if (id) {
        return id;
      }
    }
  }
  return null;
}
