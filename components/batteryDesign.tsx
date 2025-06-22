'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Battery, Calculator } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const BatteryDesign = () => {
  const { energyData, batteryInputs, setBatteryInputs } = useAppStore();
  const [useCustomDOD, setUseCustomDOD] = useState(false);
  const [customDOD, setCustomDOD] = useState(0);

  const depthOfDischarge = useCustomDOD ? customDOD : (batteryInputs.batteryType === "lithium" ? 0.8 : 0.5);

  const calculateBatteries = () => {
    if (energyData.totalRawEnergy === 0) return 0;
    
    // Convert kWh to Wh
    const totalRawEnergyInWh = energyData.totalRawEnergy * 1000;
    const denominator = batteryInputs.performanceLoss * batteryInputs.lossFactor * depthOfDischarge * batteryInputs.preferredVoltage * batteryInputs.batteryCurrentRating;
    return Math.ceil(totalRawEnergyInWh / denominator);
  };

  const numberOfBatteries = calculateBatteries();

  if (energyData.totalRawEnergy === 0) {
    return (
      <div className="text-center py-8">
        <Battery className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit first to calculate battery requirements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Battery Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Battery Type</Label>
              <RadioGroup 
                value={batteryInputs.batteryType} 
                onValueChange={(value: "lithium" | "lead-acid") => 
                  setBatteryInputs({ ...batteryInputs, batteryType: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lithium" id="lithium" />
                  <Label htmlFor="lithium">Lithium Ion (DOD: 80%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lead-acid" id="lead-acid" />
                  <Label htmlFor="lead-acid">Lead Acid (DOD: 50%)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">System Parameters</Label>
              
              <div className="space-y-2">
                <Label htmlFor="performance">Performance Loss Factor</Label>
                <Input
                  id="performance"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={batteryInputs.performanceLoss}
                  onChange={(e) => setBatteryInputs({
                    ...batteryInputs,
                    performanceLoss: parseFloat(e.target.value) || 0.85
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loss">Loss Factor</Label>
                <Input
                  id="loss"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={batteryInputs.lossFactor}
                  onChange={(e) => setBatteryInputs({
                    ...batteryInputs,
                    lossFactor: parseFloat(e.target.value) || 0.8
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voltage">Preferred Battery Voltage (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  min="1"
                  value={batteryInputs.preferredVoltage}
                  onChange={(e) => setBatteryInputs({
                    ...batteryInputs,
                    preferredVoltage: parseFloat(e.target.value) || 12
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">Battery Current Rating (Ah)</Label>
                <Input
                  id="current"
                  type="number"
                  min="1"
                  value={batteryInputs.batteryCurrentRating}
                  onChange={(e) => setBatteryInputs({
                    ...batteryInputs,
                    batteryCurrentRating: parseFloat(e.target.value) || 200
                  })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="custom-dod"
                    checked={useCustomDOD}
                    onChange={(e) => setUseCustomDOD(e.target.checked)}
                  />
                  <Label htmlFor="custom-dod">Use Custom Depth of Discharge</Label>
                </div>
                {useCustomDOD && (
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    placeholder="Enter DOD (0-1)"
                    value={customDOD}
                    onChange={(e) => setCustomDOD(parseFloat(e.target.value) || 0)}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Daily Energy Requirement</p>
                <p className="text-lg font-semibold">{(energyData.totalRawEnergy * 1000).toFixed(0)} Wh</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Battery Type</p>
                <p className="text-lg font-semibold capitalize">{batteryInputs.batteryType.replace('-', ' ')}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Battery Specifications</p>
                <p className="text-lg font-semibold">{batteryInputs.preferredVoltage}V / {batteryInputs.batteryCurrentRating}Ah</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Depth of Discharge</p>
                <p className="text-lg font-semibold">{(depthOfDischarge * 100).toFixed(0)}%</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Required Batteries</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">{numberOfBatteries}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Based on {batteryInputs.batteryType} battery specifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-mono text-sm">
              Number of Batteries = Total Raw Energy (Wh) ÷ (Performance Loss × Loss Factor × Depth of Discharge × Battery Voltage × Battery Current Rating)
            </p>
            <p className="font-mono text-sm mt-2">
              = {(energyData.totalRawEnergy * 1000).toFixed(0)} ÷ ({batteryInputs.performanceLoss} × {batteryInputs.lossFactor} × {depthOfDischarge} × {batteryInputs.preferredVoltage} × {batteryInputs.batteryCurrentRating}) = {numberOfBatteries}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};