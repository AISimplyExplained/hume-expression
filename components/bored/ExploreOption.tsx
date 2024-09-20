import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type ExplorationOptionType =
  | "Show me a simple use-case"
  | "Give me a quick poll"
  | "Test me with a quiz"
  | "";

const options: ExplorationOptionType[] = [
  "Show me a simple use-case",
  "Give me a quick poll",
  "Test me with a quiz",
];

export const ExploreOptions: React.FC<{
  handleOptionClick: (option: ExplorationOptionType) => void;
}> = ({ handleOptionClick }) => (
  <DialogContent className="max-w-3xl flex flex-col gap-8">
    <DialogHeader>
      <DialogTitle className="text-2xl">Explore this topic further</DialogTitle>
      <DialogDescription className="mx-1 text-lg">
        No problem! How would you like to explore this topic further?
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-wrap gap-4 justify-center">
      {options.map((option) => (
        <Button key={option} onClick={() => handleOptionClick(option)}>
          {option}
        </Button>
      ))}
    </div>
  </DialogContent>
);
