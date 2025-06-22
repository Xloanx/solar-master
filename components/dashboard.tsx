
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { Calculator, Battery, Sun, Zap, History, Plus, Menu, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";

interface ProjectType {
  id: string;
  name: string;
  createdAt: string;
  notes?: string;
  energyData: {
    appliances: Array<{
      id: string;
      name: string;
      quantity: number;
      powerRating: number;
      isInductive: boolean;
      runtime: number;
      totalPower: number;
      surgeFactor: number;
      dailyConsumption: number;
    }>;
    totalRawEnergy: number;
    totalSurgeFactor: number;
  };
}

interface ProjectStatus {
  status: string;
  color: string;
}

export const Dashboard = () => {
  const { 
    projects, 
    currentProject, 
    loadProject, 
    deleteProject,
    energyData,
    sidebarOpen,
    setSidebarOpen 
  } = useAppStore();

  const getProjectStatus = (project: ProjectType): ProjectStatus => {
    if (project.energyData.appliances.length === 0) return { status: "Not Started", color: "bg-gray-500" };
    if (project.energyData.totalRawEnergy > 0) return { status: "In Progress", color: "bg-yellow-500" };
    return { status: "Completed", color: "bg-green-500" };
  };

  const getTotalProjects = () => projects.length;
  const getCompletedProjects = () => projects.filter(p => p.energyData.totalRawEnergy > 0).length;
  const getTotalEnergyDesigned = () => projects.reduce((sum, p) => sum + p.energyData.totalRawEnergy, 0);

  return (
    <div className="space-y-6">
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Projects</SheetTitle>
              <SheetDescription>Manage your solar installation projects</SheetDescription>
            </SheetHeader>
            <ProjectsList />
          </SheetContent>
        </Sheet>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalProjects()}</div>
            <p className="text-xs text-muted-foreground">
              Solar installations designed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCompletedProjects()}</div>
            <p className="text-xs text-muted-foreground">
              Projects with calculations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalEnergyDesigned().toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Wh designed across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Project</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentProject ? energyData.appliances.length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Appliances in current audit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Project Overview */}
      {currentProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Current Project: {currentProject.name}
            </CardTitle>
            <CardDescription>
              Created {format(new Date(currentProject.createdAt), 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Energy Consumption</p>
                <p className="text-2xl font-bold text-blue-600">
                  {energyData.totalRawEnergy.toFixed(0)} Wh
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Surge Factor</p>
                <p className="text-2xl font-bold text-orange-600">
                  {energyData.totalSurgeFactor.toFixed(0)} W
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Appliances</p>
                <p className="text-2xl font-bold text-green-600">
                  {energyData.appliances.length}
                </p>
              </div>
            </div>
            {currentProject.notes && (
              <div className="mt-4">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{currentProject.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Projects
          </CardTitle>
          <CardDescription>
            Your latest solar installation designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No projects yet</p>
              <p className="text-sm text-gray-400 mt-2">Start by creating your first solar installation project</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(-5).reverse().map((project) => {
                const status = getProjectStatus(project);
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge className={`${status.color} text-white text-xs`}>
                          {status.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {project.energyData.totalRawEnergy.toFixed(0)} Wh • {project.energyData.appliances.length} appliances
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(project.createdAt), 'PPp')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadProject(project.id)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProjectsList = () => {
  const { projects, loadProject, deleteProject, currentProject } = useAppStore();

  const getProjectStatus = (project: ProjectType): ProjectStatus => {
    if (project.energyData.appliances.length === 0) return { status: "Not Started", color: "bg-gray-500" };
    if (project.energyData.totalRawEnergy > 0) return { status: "In Progress", color: "bg-yellow-500" };
    return { status: "Completed", color: "bg-green-500" };
  };

  return (
    <div className="space-y-4 mt-4">
      {projects.map((project) => {
        const status = getProjectStatus(project);
        const isActive = currentProject?.id === project.id;
        
        return (
          <div
            key={project.id}
            className={`p-3 border rounded-lg transition-colors ${
              isActive ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{project.name}</h4>
                <p className="text-xs text-gray-500">
                  {project.energyData.totalRawEnergy.toFixed(0)} Wh
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadProject(project.id)}
                  disabled={isActive}
                >
                  {isActive ? 'Active' : 'Load'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProject(project.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
