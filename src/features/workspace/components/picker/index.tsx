"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import LoaderIcon from "@/shared/components/loader-icon";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useRegisterClickOutside } from "@/shared/contexts/click-outside-context";

const EmojiPicker = dynamic(() => import("./emoji-picker"), {
  ssr: false,
  loading: () => (
    <div className="bg-neutral-800 w-[390px] h-[330px] flex items-center justify-center">
      <LoaderIcon />
    </div>
  ),
});
const IconPicker = dynamic(() => import("./icon-picker"), {
  ssr: false,
  loading: () => (
    <div className="bg-neutral-800 w-[390px] h-[330px] flex items-center justify-center">
      <LoaderIcon />
    </div>
  ),
});

type Props = {
  children: React.ReactNode;
  className?: string;
  onChangeIcon?: (data: PickerData) => void;
  onRemove?: () => void;
};

type PickerData = {
  iconUrl: string;
  icon?: string;
  name: string;
};

const tabs = [
  {
    label: "Emoji",
    value: "emoji",
  },
  {
    label: "Icon",
    value: "icon",
  },
];

export default function Picker({
  children,
  className,
  onChangeIcon,
  onRemove,
}: Props) {
  const onGetIcon = (data: PickerData) => {
    onChangeIcon?.(data);
  };
  const onRemoveIcon = () => {
    onRemove?.();
  };

  const ref = useRegisterClickOutside<HTMLDivElement>();
  const iconRef = useRegisterClickOutside<HTMLDivElement>();

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <div className={cn(className)} ref={iconRef}>
          {children}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={ref}
        collisionPadding={10}
        avoidCollisions={true}
        side="left"
        className="p-0 bg-neutral-800 w-fit pointer-events-auto h-[370px]"
      >
        <Tabs defaultValue="emoji" className="gap-0 flex flex-col w-full">
          <div className="w-full flex items-center flex-row gap-2">
            <TabsList>
              {tabs.map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-sm hover:!bg-muted-foreground/10 !bg-transparent border-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex-1 flex justify-end pr-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveIcon}
                className="text-sm hover:!bg-muted-foreground/10 !text-muted-foreground"
              >
                Remove
              </Button>
            </div>
          </div>
          <Separator />
          <TabsContent
            value="emoji"
            className="bg-neutral-800 h-[330px] overflow-auto pointer-events-auto"
          >
            <EmojiPicker onSelectEmoji={onGetIcon} />
          </TabsContent>
          <TabsContent
            value="icon"
            className="overflow-auto pointer-events-auto h-[330px]"
          >
            <IconPicker onSelectIcon={onGetIcon} />
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
