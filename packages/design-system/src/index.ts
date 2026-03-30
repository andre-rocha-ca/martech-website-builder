// ─── @martech/design-system ─────────────────────────────────
// ContaAzul Martech Design System
// Auto-synced with Figma via AI-powered component generation
// All shadcn/ui components + AI documentation registry

// ─── Utilities ──────────────────────────────────────────────
export { cn } from "./lib/utils";

// ─── UI Components ──────────────────────────────────────────

// Accordion
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/ui/accordion";

// Alert
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";

// Alert Dialog
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./components/ui/alert-dialog";

// Aspect Ratio
export { AspectRatio } from "./components/ui/aspect-ratio";

// Avatar
export { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";

// Badge
export { Badge, badgeVariants, type BadgeProps } from "./components/ui/badge";

// Button (shadcn — generic)
export { Button, buttonVariants, type ButtonProps } from "./components/ui/button";

// CAButton — Conta Azul branded button (DS_CA Figma)
export {
  CAButton,
  caButtonVariants,
  TOKENS as caTokens,
  type CAButtonProps,
} from "./components/ui/ca-button";

// CAButtonNav — navigation link button (DS_CA Figma)
export {
  CAButtonNav,
  caButtonNavVariants,
  type CAButtonNavProps,
} from "./components/ui/ca-button-nav";

// CAWhatsAppButton — floating WhatsApp CTA (DS_CA Figma)
export { CAWhatsAppButton, type CAWhatsAppButtonProps } from "./components/ui/ca-whatsapp-button";

// CAPricingCard — pricing plan card (DS_CA Figma)
export { CAPricingCard, type CAPricingCardProps } from "./components/ui/ca-pricing-card";

// CAFeatureItem — expandable feature accordion item (DS_CA Figma)
export { CAFeatureItem, type CAFeatureItemProps } from "./components/ui/ca-feature-item";

// CAHero — hero section with bg/align variants (DS_CA Figma)
export { CAHero, type CAHeroProps } from "./components/ui/ca-hero";

// CA icon asset paths
export * as caIcons from "./assets/icons";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/ui/card";

// Checkbox
export { Checkbox } from "./components/ui/checkbox";

// Command
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./components/ui/command";

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";

// Form
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "./components/ui/form";

// Hover Card
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./components/ui/hover-card";

// Input
export { Input, type InputProps } from "./components/ui/input";

// Label
export { Label } from "./components/ui/label";

// Navigation Menu
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";

// Popover
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "./components/ui/popover";

// Progress
export { Progress } from "./components/ui/progress";

// Radio Group
export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

// Scroll Area
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";

// Separator
export { Separator } from "./components/ui/separator";

// Sheet
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";

// Skeleton
export { Skeleton } from "./components/ui/skeleton";

// Slider
export { Slider } from "./components/ui/slider";

// Switch
export { Switch } from "./components/ui/switch";

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

// Textarea
export { Textarea } from "./components/ui/textarea";

// Toast
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
} from "./components/ui/toast";
export { Toaster } from "./components/ui/toaster";
export { useToast, toast } from "./components/ui/use-toast";

// Tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/ui/tooltip";

// ─── Design Tokens ──────────────────────────────────────────
export { designTokens, type DesignTokenConfig } from "./tokens/design-tokens";

// ─── AI-Ready Component Documentation ───────────────────────
export {
  componentDocRegistry,
  serializeRegistryForPrompt,
  buttonDoc,
  cardDoc,
  inputDoc,
  badgeDoc,
  separatorDoc,
  navigationMenuDoc,
} from "./docs/index";
export type {
  ComponentDoc,
  ComponentDocRegistry,
  PropDoc,
  SlotDoc,
  TrackingEventDoc,
  FigmaMappingHint,
} from "./types/component-doc.types";
