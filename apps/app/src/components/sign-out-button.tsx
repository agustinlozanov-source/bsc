import { LogOut } from "lucide-react";
import { Button } from "@bsc/ui";
import { signOut } from "@/app/(auth)/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button variant="ghost" size="sm" type="submit">
        <LogOut className="size-4" />
        Salir
      </Button>
    </form>
  );
}
