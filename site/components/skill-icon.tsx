import {
  Bot,
  FileText,
  GalleryHorizontal,
  GitBranch,
  KeyRound,
  Lightbulb,
  Lock,
  MessageSquare,
  MessagesSquare,
  MousePointer2,
  Palette,
  PenLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SkillIcon as SkillIconName } from "@/config/skills";
import { cn } from "@/lib/cn";

const ICONS: Record<SkillIconName, LucideIcon> = {
  bot: Bot,
  "file-text": FileText,
  "gallery-horizontal": GalleryHorizontal,
  "git-branch": GitBranch,
  "key-round": KeyRound,
  lightbulb: Lightbulb,
  lock: Lock,
  "message-square": MessageSquare,
  "messages-square": MessagesSquare,
  "mouse-pointer": MousePointer2,
  palette: Palette,
  "pen-line": PenLine,
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  users: Users,
};

export function SkillIcon({ icon, className }: { icon: SkillIconName; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden className={cn("size-4 shrink-0", className)} />;
}
