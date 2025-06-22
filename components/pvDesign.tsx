'use client'


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sun, Calculator, MapPin } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const PVDesign = () => {
  const { energyData, pvInputs, setPVInputs } = useAppStore();

  const calculatePanels = () => {
    if (energyData.totalRawEnergy === 0) return 0;
    
    const denominator = pvInputs.performanceFactor * pvInputs.lossFactor * pvInputs.peakSunHour * (pvInputs.pvWattage);
    return Math.ceil(energyData.totalRawEnergy / denominator);
  };

  const totalRawEnergyInWatt = energyData.totalRawEnergy*1000
  const numberOfPanels = calculatePanels();
  const totalPVCapacity = numberOfPanels * pvInputs.pvWattage;

  if (energyData.totalRawEnergy === 0) {
    return (
      <div className="text-center py-8">
        <Sun className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit first to calculate PV requirements</p>
      </div>
    );
  }

  const commonLocations = [
    { name: "Lagos, Nigeria", psh: 4.5 },
    { name: "Abuja, Nigeria", psh: 5.2 },
    { name: "Kano, Nigeria", psh: 5.8 },
    { name: "Port Harcourt, Nigeria", psh: 4.2 },
    { name: "Jos, Nigeria", psh: 6.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>PV System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Installation Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  placeholder="e.g., Lagos, Nigeria"
                  value={pvInputs.location}
                  onChange={(e) => setPVInputs({ ...pvInputs, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Location Selection</Label>
              <div className="grid grid-cols-1 gap-2">
                {commonLocations.map((loc) => (
                  <Button
                    key={loc.name}
                    variant="outline"
                    size="sm"
                    onClick={() => setPVInputs({ 
                      ...pvInputs, 
                      location: loc.name, 
                      peakSunHour: loc.psh 
                    })}
                    className="justify-start text-xs"
                  >
                    {loc.name} ({loc.psh} PSH)
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">System Parameters</Label>
              
              <div className="space-y-2">
                <Label htmlFor="performance-factor">Performance Factor</Label>
                <Input
                  id="performance-factor"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={pvInputs.performanceFactor}
                  onChange={(e) => setPVInputs({
                    ...pvInputs,
                    performanceFactor: parseFloat(e.target.value) || 0.65
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loss-factor">Loss Factor</Label>
                <Input
                  id="loss-factor"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={pvInputs.lossFactor}
                  onChange={(e) => setPVInputs({
                    ...pvInputs,
                    lossFactor: parseFloat(e.target.value) || 0.85
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peak-sun-hour">Peak Sun Hours</Label>
                <Input
                  id="peak-sun-hour"
                  type="number"
                  step="0.1"
                  min="0"
                  value={pvInputs.peakSunHour}
                  onChange={(e) => setPVInputs({
                    ...pvInputs,
                    peakSunHour: parseFloat(e.target.value) || 5.5
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pv-wattage">PV Panel Wattage</Label>
                <Input
                  id="pv-wattage"
                  type="number"
                  min="0"
                  value={pvInputs.pvWattage}
                  onChange={(e) => setPVInputs({
                    ...pvInputs,
                    pvWattage: parseInt(e.target.value) || 180
                  })}
                />
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
                <p className="text-lg font-semibold">{energyData.totalRawEnergy.toFixed(2)} kWh</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-lg font-semibold">{pvInputs.location || "Not specified"}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Peak Sun Hours</p>
                <p className="text-lg font-semibold">{pvInputs.peakSunHour} hours</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Panel Wattage</p>
                <p className="text-lg font-semibold">{pvInputs.pvWattage}W per panel</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Required Solar Panels</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{numberOfPanels}</p>
                <p className="text-sm text-green-600 mt-1">
                  Total capacity: {totalPVCapacity}W ({(totalPVCapacity/1000).toFixed(1)}kW)
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
              Number of Panels = Total Raw Energy ÷ (Performance Factor × Loss Factor × Peak Sun Hour × PV Wattage in W)
            </p>
            <p className="font-mono text-sm mt-2">
              = {totalRawEnergyInWatt.toFixed(2)} ÷ ({pvInputs.performanceFactor} × {pvInputs.lossFactor} × {pvInputs.peakSunHour} × {(pvInputs.pvWattage).toFixed(2)}) = {numberOfPanels}
            </p>
          </div>
        </CardContent>
      </Card>

      {pvInputs.location && (
        <Card>
          <CardHeader>
            <CardTitle>Location-Specific Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>For {pvInputs.location}:</strong> Consider seasonal variations in solar irradiance. 
                The peak sun hours of {pvInputs.peakSunHour} represent annual average. 
                You may want to add 10-20% extra capacity to account for cloudy seasons.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
