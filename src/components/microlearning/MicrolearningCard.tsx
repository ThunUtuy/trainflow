import { motion, type Variants } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface ModulePage {
  id: string;
  type: string;
  title: string;
  content: any;
  sort_order: number;
}

interface MicrolearningCardProps {
  page: ModulePage;
  direction: number; // -1 for back, 1 for forward
}

const variants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
  }),
};

const MicrolearningCard = ({ page, direction }: MicrolearningCardProps) => {
  const renderMedia = () => {
    if (page.type === "image" && page.content?.url) {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
          <img
            src={page.content.url}
            alt={page.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    if (page.type === "video" && page.content?.url) {
      if (page.content.url.includes("module-videos")) {
        return (
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <video src={page.content.url} controls className="w-full h-full object-cover" />
          </div>
        );
      }
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
          <iframe src={page.content.url} className="h-full w-full" allowFullScreen />
        </div>
      );
    }
    return null;
  };

  const renderBody = () => {
    if (page.type === "checklist") {
      return (
        <ul className="space-y-3 w-full">
          {(page.content?.items || []).map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <Checkbox id={`${page.id}-${i}`} className="mt-0.5" />
              <label
                htmlFor={`${page.id}-${i}`}
                className="text-sm cursor-pointer select-none leading-relaxed"
              >
                {item}
              </label>
            </li>
          ))}
        </ul>
      );
    }
    if (page.content?.text) {
      return (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {page.content.text}
        </p>
      );
    }
    return null;
  };

  return (
    <motion.div
      key={page.id}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col items-center gap-5 w-full px-1"
    >
      {renderMedia()}

      <h2 className="text-lg font-semibold text-center">{page.title}</h2>

      {renderBody()}
    </motion.div>
  );
};

export default MicrolearningCard;
