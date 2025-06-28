import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Calculator } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const InverterCalculator = () => {
  const { energyData } = useAppStore();

  if (energyData.totalSurgeFactor === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit first to calculate inverter requirements</p>
      </div>
    );
  }

  const inverterWatts = energyData.totalSurgeFactor;
  const inverterKVA = inverterWatts / 0.85; // Convert to KVA using power factor of 0.85
  const inverterKVA_ = inverterKVA/1000
  // const recommendedBrands = [
  //   { name: "Victron Energy", models: ["MultiPlus", "Quattro"], efficiency: "95%+" },
  //   { name: "SMA", models: ["Sunny Boy", "Sunny Island"], efficiency: "97%+" },
  //   { name: "Schneider Electric", models: ["Conext", "XW Pro"], efficiency: "94%+" },
  //   { name: "Outback Power", models: ["FXR", "Radian"], efficiency: "93%+" },
  //   { name: "Magnum Energy", models: ["MS-PAE", "MMS"], efficiency: "90%+" },
  // ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-orange-600" />
              Inverter Rating (Watts)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">
                {inverterWatts.toFixed(0)} W
              </p>
              <p className="text-sm text-gray-600">
                Based on total surge factor from your appliances
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Inverter Rating (KVA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {inverterKVA_.toFixed(1)} KVA
              </p>
              <p className="text-sm text-gray-600">
                Converted using power factor of 0.85
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Total Surge Factor</p>
              <p className="text-lg font-semibold">{energyData.totalSurgeFactor.toFixed(0)} W</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-mono text-sm">
                Required Inverter Capacity (Watts) = Total Surge Factor = {inverterWatts.toFixed(0)} W
              </p>
              <p className="font-mono text-sm mt-2">
                Required Inverter Capacity (KVA) = Total Surge Factor ÷ 0.85 = {inverterKVA.toFixed(1)} KVA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
};
