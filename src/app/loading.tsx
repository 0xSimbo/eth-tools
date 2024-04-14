import React from "react";
import { Loader2 } from "lucide-react";
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="animate-spin" size={64} />
    </div>
  );
};

export default Loading;
