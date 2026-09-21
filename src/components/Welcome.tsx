import { MonitorSmartphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function welcome() {
  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <span>Welcome to</span>

      <div className="flex items-center gap-3">
        <MonitorSmartphone />

        <h1 className="text-2xl font-bold text-gray-800">Digital Shop</h1>
      </div>

      <Link href="/products" className="mt-6">
        <Button>Go to products</Button>
      </Link>
    </div>
  );
}

export default welcome;
