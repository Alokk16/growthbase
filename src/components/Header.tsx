
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  onOpenChat?: (context?: any) => void;
}

const Header = ({ onOpenChat }: HeaderProps) => {
  return (
    <header className="h-16 md:h-20 border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img
                src="/favicon.ico"
                alt="GrowthBase logo"
                className="h-10 w-10 rounded-md object-contain md:h-12 md:w-12"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold gradient-text">GrowthBase</h1>
                <p className="hidden sm:block text-xs md:text-sm text-muted-foreground">Smarter Tools. Sharper Calm.</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Badge variant="outline" className="hidden sm:flex border-primary/30 text-primary text-xs">
              🇮🇳 Made for Indian Startups
            </Badge>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => onOpenChat?.({ type: "general", message: "How can I help you today?" })}>
              <MessageCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Ask SwiftCFO</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
