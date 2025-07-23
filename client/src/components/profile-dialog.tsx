import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { User as UserIcon, Mail, Phone, Briefcase, IndianRupee, Edit2, Save, X } from "lucide-react";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDialog({ isOpen, onClose }: ProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    monthlyIncome: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
    enabled: isOpen,
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        occupation: user.occupation || "",
        monthlyIncome: user.monthlyIncome || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updateData = {
      ...formData,
      monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : undefined,
    };
    
    // Remove empty fields
    Object.keys(updateData).forEach(key => {
      if (!updateData[key as keyof typeof updateData]) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        occupation: user.occupation || "",
        monthlyIncome: user.monthlyIncome || "",
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-500">Loading profile...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            User Profile
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-slate-600 hover:text-slate-800"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Avatar */}
          <div className="flex justify-center">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.fullName ? getInitials(user.fullName) : <UserIcon className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-slate-500" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{user?.fullName || "Not set"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-slate-500" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{user?.email || "Not set"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-slate-500" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-700">Phone</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{user?.phone || "Not set"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-slate-500" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-700">Occupation</Label>
                {isEditing ? (
                  <Input
                    value={formData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Enter your occupation"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{user?.occupation || "Not set"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IndianRupee className="h-5 w-5 text-slate-500" />
              <div className="flex-1">
                <Label className="text-sm font-medium text-slate-700">Monthly Income</Label>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-slate-500">₹</span>
                    <Input
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={(e) => handleInputChange("monthlyIncome", e.target.value)}
                      placeholder="0"
                      className="pl-7"
                    />
                  </div>
                ) : (
                  <p className="text-slate-900 mt-1">
                    {user?.monthlyIncome 
                      ? `₹${new Intl.NumberFormat('en-IN').format(parseFloat(user.monthlyIncome))}` 
                      : "Not set"
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}