import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showToast } from "@/components/ui/own/ShowToast";
import { handleAPIError } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { PasswordChangeDTO } from "@/API";

interface PasswordChangeCardProps {
  onChangePassword: (dto: { passwordChangeDTO: PasswordChangeDTO }) => Promise<string>;
}

export default function PasswordChangeCard({ onChangePassword }: PasswordChangeCardProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => onChangePassword({ passwordChangeDTO: { oldPassword, newPassword } }),
    onSuccess: () => {
      showToast.success("Jelszó sikeresen megváltoztatva!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: handleAPIError,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast.error("Az új jelszavak nem egyeznek!");
      return;
    }
    if (newPassword.length < 4) {
      showToast.error("Az új jelszónak legalább 4 karakter hosszúnak kell lennie!");
      return;
    }
    mutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jelszó módosítása</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Jelenlegi jelszó</Label>
            <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </div>
          <div>
            <Label>Új jelszó</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div>
            <Label>Új jelszó megerősítése</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Mentés..." : "Jelszó módosítása"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
