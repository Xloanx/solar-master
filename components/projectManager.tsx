'use client'

import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const ProjectManager = () => {
  const { saveProject, currentProject } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    saveProject(projectName, projectNotes);
    toast.success("Project saved successfully!");
    setIsOpen(false);
    setProjectName("");
    setProjectNotes("");
  };

  return (
    <div className="flex items-center gap-4">
      {currentProject && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Current: {currentProject.name}</span>
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Project
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Solar Installation Project</DialogTitle>
            <DialogDescription>
              Save your current energy audit and calculations as a project for future reference.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Smith Residence Solar Installation"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="projectNotes">Notes (Optional)</Label>
              <Textarea
                id="projectNotes"
                placeholder="Add any additional notes about this project..."
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
