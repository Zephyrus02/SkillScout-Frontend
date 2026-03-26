import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Grid3X3,
  LayoutList,
  Lightbulb,
  Link as LinkIcon,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Mic,
  PauseCircle,
  Play,
  SearchX,
  Send,
  Settings,
  Volume2,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  arrow_forward: ArrowRight,
  calendar_today: Calendar,
  check_circle: CheckCircle,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  close: X,
  content_copy: Copy,
  copy: Copy,
  dashboard: Settings,
  expand_more: ChevronRight,
  grid_view: Grid3X3,
  lightbulb: Lightbulb,
  link: LinkIcon,
  logout: LogOut,
  mail: Mail,
  menu: Menu,
  mic: Mic,
  pause_circle: PauseCircle,
  play_arrow: Play,
  schedule: Calendar,
  search_off: SearchX,
  send: Send,
  settings: Settings,
  autorenew: Loader2,
  view_list: LayoutList,
  volume_up: Volume2,
};

export function Icon({
  name,
  className,
  size,
  title,
}: {
  name: string;
  className?: string;
  size?: number;
  title?: string;
}) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp className={className} size={size} aria-label={title ?? name} />;
}
