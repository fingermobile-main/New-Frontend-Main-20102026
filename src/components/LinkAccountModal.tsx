import { Link as RouterLink } from 'react-router-dom';
import React, { useState } from 'react';
import { Link, Wallet, CreditCard, Banknote, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";

interface AccountType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  connected?: boolean;
}

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkAccount?: (accountType: string, credentials: unknown) => void;
  onUnlinkAccount?: (accountType: string) => void;
}

const LinkAccountModal: React.FC<LinkAccountModalProps> = ({
  isOpen,
  onClose,
  onLinkAccount,
  onUnlinkAccount
}) => {
  const [selectedAccount, setSelectedAccount] = React.useState<string | null>(null);
  const [credentials, setCredentials] = React.useState({ username: "", password: "" });

  const accountTypes: AccountType[] = [
    {
      id: "bank",
      name: "Bank Account",
      icon: <Banknote className="h-6 w-6" />,
      description: "Connect your bank account for direct transfers",
      connected: false
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <CreditCard className="h-6 w-6" />,
      description: "Link your PayPal account for quick payments",
      connected: true
    },
    {
      id: "crypto",
      name: "Crypto Wallet",
      icon: <Wallet className="h-6 w-6" />,
      description: "Connect your cryptocurrency wallet",
      connected: false
    }
  ];

  const handleLinkAccount = () => {
    if (selectedAccount) {
      onLinkAccount?.(selectedAccount, credentials);
      setCredentials({ username: "", password: "" });
      setSelectedAccount(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Account
          </DialogTitle>
          <DialogDescription>
            Connect external accounts to enable seamless transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!selectedAccount ? (
            <div className="grid gap-3">
              {accountTypes.map((account) => (
                <div
                  key={account.id}
                  className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    account.connected ? "bg-green-50 border-green-200" : ""
                  }`}
                  onClick={() => !account.connected && setSelectedAccount(account.id)} role="button" tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {account.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{account.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {account.description}
                        </p>
                      </div>
                    </div>
                    {account.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          Connected
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnlinkAccount?.(account.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">
                  {accountTypes.find((a) => a.id === selectedAccount)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter your credentials to securely link this account
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="username">Username / Email</Label>
                  <Input
                    id="username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({ ...credentials, username: e.target.value })
                    }
                    placeholder="Enter your username or email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })
                    }
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedAccount(null)}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleLinkAccount}>
                  Link Account
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            Your credentials are encrypted and stored securely. We never share your information.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkAccountModal;
