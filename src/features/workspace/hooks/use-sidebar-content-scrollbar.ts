import { useEffect, useRef } from "react";

export const useSidebarContentScrollbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollStateRef = useRef<"top" | "middle" | "bottom" | "hidden">(
    "hidden"
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Update the classes of the container based on the scroll state.
    const updateClasses = (state: "top" | "middle" | "bottom" | "hidden") => {
      if (!el) return;

      el.classList.remove("!border-t-border/100", "!border-b-border/100");

      if (state === "hidden") return;

      switch (state) {
        case "top":
          el.classList.add("!border-b-border/100");
          break;
        case "bottom":
          el.classList.add("!border-t-border/100");
          break;
        case "middle":
          el.classList.add("!border-t-border/100", "!border-b-border/100");
          break;
      }
    };

    // Handle the scroll event.
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;

      // If the container is not scrollable, set the scroll state to hidden.
      if (scrollHeight <= clientHeight + 5) {
        if (scrollStateRef.current !== "hidden") {
          scrollStateRef.current = "hidden";
          updateClasses("hidden");
        }

        return;
      }

      // Check if the container is at the top or bottom.
      const atTop = scrollTop <= 5;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Determine the new scroll state.
      let newState: typeof scrollStateRef.current;
      if (atTop) newState = "top";
      else if (atBottom) newState = "bottom";
      else newState = "middle";

      if (scrollStateRef.current !== newState) {
        scrollStateRef.current = newState;
        updateClasses(newState);
      }
    };

    // Use a ResizeObserver to detect changes in the container's size or its content.
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(handleScroll);
    });

    resizeObserver.observe(el);

    // Initial check after layout.
    requestAnimationFrame(handleScroll);

    // Update the scroll state on scroll events.
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return { containerRef };
};
