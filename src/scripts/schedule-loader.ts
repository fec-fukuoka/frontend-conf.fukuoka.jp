interface ScheduleItem {
  id: string;
  title: string;
  titleEn: string;
  start: string;
  end: string | null;
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createScheduleItem(
  title: string,
  date: string,
  className?: string
): HTMLLIElement {
  const li = document.createElement("li");
  li.className = className ? `schedule-item ${className}` : "schedule-item";

  const strong = document.createElement("strong");
  strong.textContent = title;

  li.appendChild(strong);
  li.appendChild(document.createTextNode(`: ${date}`));

  return li;
}

async function loadSchedule(): Promise<void> {
  const listEl = document.getElementById("schedule-list");
  if (!listEl) return;

  const lang = listEl.dataset.lang || "ja";

  try {
    const res = await fetch("/api/schedule");
    if (!res.ok) throw new Error("Failed to fetch");

    const data: ScheduleItem[] = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    listEl.replaceChildren(
      ...data.map((item) => {
        const title = lang === "ja" ? item.title : item.titleEn;
        const date = formatDate(item.start, lang);
        const itemDate = new Date(item.start);
        const isPast = itemDate < today;
        return createScheduleItem(
          title,
          date,
          isPast ? "schedule-item--past" : "schedule-item--upcoming"
        );
      })
    );
  } catch {
    const errorLi = document.createElement("li");
    errorLi.className = "schedule-item schedule-error";
    errorLi.textContent =
      lang === "ja"
        ? "スケジュールの読み込みに失敗しました"
        : "Failed to load schedule";
    listEl.replaceChildren(errorLi);
  }
}

// 初回ロードとView Transitionsによるソフトナビゲーション後の両方で実行
document.addEventListener("astro:page-load", loadSchedule);
