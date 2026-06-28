document.querySelectorAll<HTMLElement>(".tt").forEach((root) => {
  // --- Tabs (track switcher) ---
  const tabs = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[role="tabpanel"]')
  );

  const activate = (index: number, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(i));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const dir = event.key === "ArrowRight" ? 1 : -1;
        activate((i + dir + tabs.length) % tabs.length, true);
      } else if (event.key === "Home") {
        event.preventDefault();
        activate(0, true);
      } else if (event.key === "End") {
        event.preventDefault();
        activate(tabs.length - 1, true);
      }
    });
  });

  // --- View switcher (list / grid) ---
  const viewButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>(".tt-view-btn")
  );
  const viewPanels = Array.from(
    root.querySelectorAll<HTMLElement>("[data-view-panel]")
  );

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      viewButtons.forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button))
      );
      viewPanels.forEach((panel) => {
        panel.hidden = panel.dataset.viewPanel !== view;
      });
    });
  });
});
