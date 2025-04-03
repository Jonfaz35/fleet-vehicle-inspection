
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { InviteUserData, User, UserRole } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, UserPlus, Check, X } from 'lucide-react';

const Settings = () => {
  const { users, inviteUser, updateUserRole, deactivateUser, reactivateUser } = useUser();
  const { toast } = useToast();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('user');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter a valid email address.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userData: InviteUserData = {
        email: newUserEmail,
        role: newUserRole
      };
      
      await inviteUser(userData);
      setNewUserEmail('');
      setNewUserRole('user');
      setIsInviteOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to invite user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateUserRole(userId, role);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update role",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.active) {
        await deactivateUser(user.id);
      } else {
        await reactivateUser(user.id);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update user status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Management
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Enter the email address and role for the new user.
                    An invitation will be sent to their email.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteUser}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <div className="col-span-3">
                        <Input
                          id="email"
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">Role</Label>
                      <Select 
                        value={newUserRole} 
                        onValueChange={(value: UserRole) => setNewUserRole(value)}
                      >
                        <SelectTrigger id="role" className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending Invitation..."
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage users and their access to the Fleet Vehicle Inspection system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="bg-muted p-4 font-medium grid grid-cols-12 gap-4">
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {users.map((user) => (
              <div key={user.id} className="p-4 border-t grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3 font-medium">{user.name}</div>
                <div className="col-span-3 text-muted-foreground">{user.email}</div>
                <div className="col-span-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-full h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  {user.active ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                  )}
                </div>
                <div className="col-span-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.active ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
