
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const ChargeControllerRecommendation = () => {
  const { energyData, pvInputs, batteryInputs } = useAppStore();

  if (energyData.totalRawEnergy === 0) {
    return (
      <div className="text-center py-8">
        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit and PV Design first</p>
      </div>
    );
  }

  const totalPVWatts = Math.ceil(energyData.totalRawEnergy / (pvInputs.performanceFactor * pvInputs.lossFactor * pvInputs.peakSunHour * (pvInputs.pvWattage / 1000))) * pvInputs.pvWattage;
  
  const isSmallInstallation = totalPVWatts <= 1000;
  const recommendedType = isSmallInstallation ? "PWM" : "MPPT";
  
  const batteryVoltage = batteryInputs.batteryType === "lithium" ? "12V/24V/48V" : "12V/24V";
  
  const controllerRating = Math.ceil((totalPVWatts * 1.25) / (batteryInputs.batteryType === "lithium" ? 48 : 24));

  const pwmControllers = [
    { brand: "Renogy", model: "Wanderer", rating: "10A-40A", voltage: "12V/24V" },
    { brand: "AIMS Power", model: "PWM Series", rating: "10A-60A", voltage: "12V/24V" },
    { brand: "Morningstar", model: "SunSaver", rating: "6A-20A", voltage: "12V/24V" },
  ];

  const mpptControllers = [
    { brand: "Victron Energy", model: "BlueSolar/SmartSolar", rating: "15A-100A", voltage: "12V/24V/48V" },
    { brand: "Renogy", model: "Rover Series", rating: "20A-100A", voltage: "12V/24V/48V" },
    { brand: "Morningstar", model: "TriStar MPPT", rating: "45A-60A", voltage: "12V/24V/48V" },
    { brand: "Outback Power", model: "FlexMax", rating: "60A-80A", voltage: "12V/24V/48V" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Recommended Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant={recommendedType === "MPPT" ? "default" : "secondary"} className="text-lg px-4 py-2 mb-2">
                {recommendedType}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                {recommendedType === "MPPT" 
                  ? "Maximum Power Point Tracking - Higher efficiency for larger systems"
                  : "Pulse Width Modulation - Cost-effective for smaller systems"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-green-600" />
              System Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total PV Capacity:</span>
                <span className="font-semibold">{totalPVWatts}W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Battery Voltage:</span>
                <span className="font-semibold">{batteryVoltage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Min. Controller Rating:</span>
                <span className="font-semibold">{controllerRating}A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Battery Type:</span>
                <span className="font-semibold capitalize">{batteryInputs.batteryType.replace('-', ' ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended {recommendedType} Controllers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(recommendedType === "MPPT" ? mpptControllers : pwmControllers).map((controller, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{controller.brand}</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Model:</span> {controller.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rating:</span> {controller.rating}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Voltage:</span> {controller.voltage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selection Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">MPPT Controllers (Recommended for your system)</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 15-30% more efficient than PWM</li>
                <li>• Better performance in varying light conditions</li>
                <li>• Can handle higher voltage solar panels</li>
                <li>• More expensive but worth it for larger systems</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Considerations</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Choose a controller rated at least 25% higher than your calculated current</li>
                <li>• Ensure compatibility with your battery type ({batteryInputs.batteryType})</li>
                <li>• Consider programmable settings for battery optimization</li>
                <li>• Look for temperature compensation features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};