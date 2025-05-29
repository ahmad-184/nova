"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import SearchInput from "@/shared/components/search-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import iconsData from "./icons-data";
import { useRegisterClickOutside } from "@/shared/contexts/click-outside-context";

type Props = {
  onSelectIcon: (data: IconData) => void;
};

type IconData = {
  iconUrl: string;
  icon?: string;
  name: string;
};

const sortedIcons = [
  ...iconsData.categories["UI Actions"],
  ...iconsData.categories["Actions"],
  ...iconsData.categories["Text"],
  ...iconsData.categories["Social"],
  ...iconsData.categories["Communicate"],
  ...iconsData.categories["Privacy"],
  ...iconsData.categories["Travel"],
  ...iconsData.categories["Transit"],
  ...iconsData.categories["Maps"],
  ...iconsData.categories["Home"],
  ...iconsData.categories["Hardware"],
  ...iconsData.categories["Android"],
  ...iconsData.categories["AI"],
  ...iconsData.categories["Audio & Video"],
  ...iconsData.categories["Business"],
  ...iconsData.categories["Activities"],
  ...iconsData.categories["Household"],
  ...iconsData.categories["Images"],
];

type Icons = string[];

export default function IconPicker({ onSelectIcon }: Props) {
  const [icons, setIcons] = useState<Icons>([]);
  const [search, setSearch] = useState("");

  const timOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClickIcon = (data: IconData) => {
    onSelectIcon(data);
  };

  const handleSearch = (value: string) => {
    if (timOutRef.current) {
      clearTimeout(timOutRef.current);
    }
    timOutRef.current = setTimeout(() => {
      setSearch(value);
    }, 500);
  };

  const handleFetchIcons = useCallback(async (searchValue: string) => {
    try {
      if (!searchValue || !searchValue.length) return setIcons(sortedIcons);

      const res = (await fetch(
        `https://api.iconify.design/search?query=${search}&prefix=${iconsData.prefix}`
      ).then(res => res.json())) as { icons: string[] };

      const data = res.icons
        .map(icon => icon.split(":")[1])
        .filter(icon => icon !== undefined);

      return setIcons(data ?? sortedIcons);
    } catch (error) {
      return setIcons(sortedIcons);
    }
  }, []);

  useEffect(() => {
    handleFetchIcons(search);
  }, [search]);

  return (
    <Card className="bg-neutral-800 border-none rounded-md w-[390px] h-[330px] pt-4 pb-1 gap-5">
      <CardHeader className="py-0 px-2">
        <SearchInput
          placeholder="Search"
          className="w-full bg-muted-foreground/10"
          inputClassName=""
          onChange={e => handleSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent className="pl-2 pr-0 w-full py-0 flex-1">
        <div className="w-full flex flex-col gap-4">
          <p className="text-xs text-muted-foreground">Icons</p>
          <IconGrid icons={icons || []} onSelectIcon={onClickIcon} />
        </div>
      </CardContent>
    </Card>
  );
}

const ROW_HEIGHT = 40;
const COLUMNS = 10;
const BUFFER_ROWS = 5;

const IconGrid = ({
  icons,
  onSelectIcon,
}: {
  icons: string[];
  onSelectIcon: (data: IconData) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(300);

  const totalRows = Math.ceil(icons.length / COLUMNS);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setContainerHeight(container.clientHeight);

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleRowCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const startRow = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS
  );
  const endRow = Math.min(
    totalRows,
    startRow + visibleRowCount + 2 * BUFFER_ROWS
  );
  const visibleIcons = icons.slice(startRow * COLUMNS, endRow * COLUMNS);

  return (
    <div ref={containerRef} className="overflow-y-auto h-[222px] px-0 relative">
      <div style={{ height: totalRows * ROW_HEIGHT, position: "relative" }}>
        <div
          className="grid gap-2 w-full absolute left-0"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
            top: startRow * ROW_HEIGHT,
          }}
        >
          {visibleIcons.map((icon, i) => (
            <Icon
              key={startRow * COLUMNS + i}
              icon={icon}
              onSelectIcon={onSelectIcon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Icon = ({
  icon,
  onSelectIcon,
}: {
  icon: string;
  onSelectIcon: (data: IconData) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRegisterClickOutside<HTMLDivElement>();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <Image
            src={`https://api.iconify.design/${iconsData.prefix}/${icon}.svg?color=%23d8d8d8`}
            alt="icon"
            width={25}
            height={25}
            className="w-[25px] h-[25px] cursor-pointer"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent ref={ref} className="px-1 py-1 w-[198px] bg-neutral-800">
        <div className="flex flex-wrap gap-1">
          {[
            "d8d8d8",
            "737373",
            "ef4444",
            "f97316",
            "84cc16",
            "10b981",
            "06b6d4",
            "6366f1",
            "a855f7",
            "ec4899",
            "d946ef",
            "64748b",
          ].map(color => (
            <Button
              key={color}
              size={"icon"}
              variant={"ghost"}
              className="p-[4px] hover:!bg-muted-foreground/10"
              onClick={() =>
                onSelectIcon({
                  iconUrl: `https://api.iconify.design/${iconsData.prefix}/${icon}.svg?color=%23${color}`,
                  name: icon,
                })
              }
            >
              <Image
                src={`https://api.iconify.design/${iconsData.prefix}/${icon}.svg?color=%23${color}`}
                alt="icon"
                width={25}
                height={25}
                className="w-[25px] h-[25px] cursor-pointer"
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
