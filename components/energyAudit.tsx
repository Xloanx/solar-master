'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner"
import { useAppStore } from "@/store/useAppStore";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface AutoTableOptions {
  startY?: number;
  head?: string[][];
  body?: string[][];
  theme?: string;
}

interface ApplianceType {
  id: string;
  name: string;
  quantity: number | "";
  powerRating: number | "";
  isInductive: boolean;
  runtime: number | "";
  totalPower: number;
  surgeFactor: number;
  dailyConsumption: number;
}

export const EnergyAudit = () => {
  // const { toast } = useToast();
  const { energyData, setEnergyData } = useAppStore();
  // const [newAppliance, setNewAppliance] = useState({
  //     name: "",
  //     quantity: 1,
  //     powerRating: 0,
  //     isInductive: false,
  //     runtime: 8,
  // });

  const [newAppliance, setNewAppliance] = useState<{
  name: string;
  quantity: number | "";
  powerRating: number | "";
  isInductive: boolean;
  runtime: number | "";
}>({
  name: "",
  quantity: 1,
  powerRating: 0,
  isInductive: false,
  runtime: 8,
});

  const parseNumber = (value: string): number | "" => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? "" : parsed;
};


  const calculateTotals = (appliances: ApplianceType[]) => {
    const totalRawEnergy = appliances.reduce((sum, app) => sum + app.dailyConsumption, 0);
    const totalSurgeFactor = appliances.reduce((sum, app) => sum + app.surgeFactor, 0);
    return { totalRawEnergy, totalSurgeFactor };
  };

  const addAppliance = () => {
    if (!newAppliance.name || 
        newAppliance.quantity === "" || 
        newAppliance.powerRating ==="" || 
        newAppliance.runtime ==="") {
      toast("Invalid Input",{
        description: "Please provide a valid appliance name and power rating"
      });
      return;
    }

    const appliance: ApplianceType = {
      id: Date.now().toString(),
      ...newAppliance,
      totalPower: newAppliance.quantity * newAppliance.powerRating,
      surgeFactor: newAppliance.isInductive 
        ? newAppliance.quantity * newAppliance.powerRating * 4
        : newAppliance.quantity * newAppliance.powerRating,
      dailyConsumption: (newAppliance.runtime * newAppliance.quantity * newAppliance.powerRating) / 1000, // Convert to kWh
    };

    const updatedAppliances = [...energyData.appliances, appliance];
    const totals = calculateTotals(updatedAppliances);

    setEnergyData({
      appliances: updatedAppliances,
      ...totals,
    });

    setNewAppliance({
      name: "",
      quantity: 1,
      powerRating: 0,
      isInductive: false,
      runtime: 8,
    });

    toast("Appliance Added", {
      description: `${appliance.name} has been added to your energy audit`,
    });
  };

  const removeAppliance = (id: string) => {
    const updatedAppliances = energyData.appliances.filter(app => app.id !== id);
    const totals = calculateTotals(updatedAppliances);

    setEnergyData({
      appliances: updatedAppliances,
      ...totals,
    });

    toast("Appliance Removed",{
      description: "Appliance has been removed from your energy audit",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Solar Installation - Energy Audit Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
    
    const tableData = energyData.appliances.map(app => [
      app.name,
      app.quantity.toString(),
      app.powerRating.toString(),
      app.runtime.toString(),
      app.totalPower.toString(),
      app.isInductive ? 'Yes' : 'No',
      app.surgeFactor.toString(),
      app.dailyConsumption.toFixed(2)
    ]);

    doc.autoTable({
      startY: 50,
      head: [['Appliance', 'Qty', 'Power (W)', 'Runtime (hrs)', 'Total Power (W)', 'Inductive', 'Surge Factor (W)', 'Daily Consumption (kWh)']],
      body: tableData,
      theme: 'grid'
    });

    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text(`Total Raw Energy: ${energyData.totalRawEnergy.toFixed(2)} kWh/day`, 20, finalY);
    doc.text(`Total Surge Factor: ${energyData.totalSurgeFactor.toFixed(0)} W`, 20, finalY + 10);

    doc.save('energy-audit-report.pdf');
    
    toast("PDF Exported", {
      description: "Energy audit report has been exported as PDF",
    });
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    const worksheetData = [
      ['Appliance', 'Quantity', 'Power (W)', 'Runtime (hrs)', 'Total Power (W)', 'Inductive', 'Surge Factor (W)', 'Daily Consumption (kWh)'],
      ...energyData.appliances.map(app => [
        app.name,
        app.quantity,
        app.powerRating,
        app.runtime,
        app.totalPower,
        app.isInductive ? 'Yes' : 'No',
        app.surgeFactor,
        app.dailyConsumption
      ]),
      [],
      ['Summary'],
      ['Total Raw Energy (kWh/day)', energyData.totalRawEnergy.toFixed(2)],
      ['Total Surge Factor (W)', energyData.totalSurgeFactor.toFixed(0)]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Energy Audit');
    
    XLSX.writeFile(workbook, 'energy-audit-report.xlsx');
    
    toast("Excel Exported", {
      description: "Energy audit report has been exported as Excel file",
    });
  };

  // ... keep existing code (return statement with JSX)
  return (
    <div className="space-y-6">
      {/* Add Appliance Form */}
      <Card>
  <CardHeader>
    <CardTitle>Add New Appliance</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Appliance Name</Label>
        <Input
          id="name"
          placeholder="e.g., LED Light"
          value={newAppliance.name}
          onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={newAppliance.quantity ?? ""}
          onChange={(e) =>
            setNewAppliance({
              ...newAppliance,
              // quantity: e.target.value === "" ? "" : parseInt(e.target.value),
              quantity: e.target.value === "" ? "" : parseNumber(e.target.value),
            })
          }
        /> 
      </div>

      <div className="space-y-2">
        <Label htmlFor="power">Power (Watts)</Label>
        <Input
          id="power"
          type="number"
          min="0"
          value={newAppliance.powerRating ?? ""}
          onChange={(e) =>
            setNewAppliance({
              ...newAppliance,
              // powerRating: e.target.value === "" ? "" : parseInt(e.target.value),
              powerRating: e.target.value === "" ? "" : parseNumber(e.target.value),
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="runtime">Daily Runtime (hrs)</Label>
        <Input
          id="runtime"
          type="number"
          min="0"
          max="24"
          value={newAppliance.runtime ?? ""}
          onChange={(e) =>
            setNewAppliance({
              ...newAppliance,
              // runtime: e.target.value === "" ? "" : parseFloat(e.target.value),
              runtime: e.target.value === "" ? "" : parseNumber(e.target.value),
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inductive">Inductive Load</Label>
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="inductive"
            checked={newAppliance.isInductive}
            onCheckedChange={(checked) =>
              setNewAppliance({ ...newAppliance, isInductive: checked })
            }
          />
          <Label htmlFor="inductive" className="text-sm">
            {newAppliance.isInductive ? "Yes" : "No"}
          </Label>
        </div>
      </div>

      <div className="flex items-end">
        <Button onClick={addAppliance} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  </CardContent>
</Card>


      {/* Appliances Table */}
      {energyData.appliances.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Appliances List</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={exportToPDF} variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </Button>
                <Button onClick={exportToExcel} variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export Excel</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Appliance</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Power (W)</TableHead>
                    <TableHead>Runtime (hrs)</TableHead>
                    <TableHead>Total Power (W)</TableHead>
                    <TableHead>Inductive</TableHead>
                    <TableHead>Surge Factor (W)</TableHead>
                    <TableHead>Daily Consumption (kWh)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {energyData.appliances.map((appliance) => (
                    <TableRow key={appliance.id}>
                      <TableCell className="font-medium">{appliance.name}</TableCell>
                      <TableCell>{appliance.quantity}</TableCell>
                      <TableCell>{appliance.powerRating}</TableCell>
                      <TableCell>{appliance.runtime}</TableCell>
                      <TableCell>{appliance.totalPower}</TableCell>
                      <TableCell>{appliance.isInductive ? "Yes" : "No"}</TableCell>
                      <TableCell>{appliance.surgeFactor}</TableCell>
                      <TableCell>{appliance.dailyConsumption.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeAppliance(appliance.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {energyData.appliances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Raw Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {energyData.totalRawEnergy.toFixed(2)} kWh/day
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Surge Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                {energyData.totalSurgeFactor.toFixed(0)} W
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};