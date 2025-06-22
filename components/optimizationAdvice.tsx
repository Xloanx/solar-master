
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, Battery, Sun, Zap } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export const OptimizationAdvice = () => {
  const { energyData, batteryInputs, pvInputs } = useAppStore();

  if (energyData.totalRawEnergy === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Complete the Energy Audit first to get optimization advice</p>
      </div>
    );
  }

  const totalPVWatts = Math.ceil(energyData.totalRawEnergy / (pvInputs.performanceFactor * pvInputs.lossFactor * pvInputs.peakSunHour * (pvInputs.pvWattage / 1000))) * pvInputs.pvWattage;
  const numberOfBatteries = Math.ceil(energyData.totalRawEnergy / (batteryInputs.performanceLoss * batteryInputs.lossFactor * (batteryInputs.batteryType === "lithium" ? 0.8 : 0.5)));
  
  const highConsumptionAppliances = energyData.appliances
    .filter(app => app.dailyConsumption > 1)
    .sort((a, b) => b.dailyConsumption - a.dailyConsumption)
    .slice(0, 3);

  const inductiveLoads = energyData.appliances.filter(app => app.isInductive);

  const optimizationTips = [
    {
      category: "Energy Efficiency",
      icon: <TrendingDown className="h-5 w-5 text-green-600" />,
      tips: [
        "Replace incandescent bulbs with LED lights (75% energy savings)",
        "Use energy-efficient appliances with high star ratings",
        "Implement timer switches for lighting in less-used areas",
        "Consider DC appliances to reduce inverter losses"
      ]
    },
    {
      category: "System Sizing",
      icon: <Sun className="h-5 w-5 text-yellow-600" />,
      tips: [
        `Consider oversizing PV array by 20% (${Math.ceil(totalPVWatts * 1.2)}W total)`,
        "Add 1-2 extra panels for future expansion and seasonal variations",
        "Consider split-array orientation for extended daily generation",
        pvInputs.location ? "Optimize panel tilt angle for your location" : "Set panel tilt angle based on latitude"
      ]
    },
    {
      category: "Battery Optimization",
      icon: <Battery className="h-5 w-5 text-blue-600" />,
      tips: [
        batteryInputs.batteryType === "lithium" ? "Lithium batteries chosen - excellent choice for efficiency" : "Consider upgrading to lithium for better performance",
        `Current design: ${numberOfBatteries} batteries - consider adding 1 extra for redundancy`,
        "Implement proper battery management system (BMS)",
        "Ensure adequate ventilation for battery bank"
      ]
    },
    {
      category: "Cost Optimization",
      icon: <Zap className="h-5 w-5 text-purple-600" />,
      tips: [
        "Buy solar panels in bulk for better pricing",
        "Consider local assembly to reduce import costs",
        "Implement load scheduling to reduce peak power requirements",
        "Use hybrid inverters for better integration"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* High Consumption Appliances Alert */}
      {highConsumptionAppliances.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingDown className="h-5 w-5" />
              High Energy Consumers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-3">
              These appliances consume the most energy. Consider optimizing or replacing them:
            </p>
            <div className="space-y-2">
              {highConsumptionAppliances.map((appliance, index) => (
                <div key={appliance.id} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">{appliance.name}</span>
                  <Badge variant="destructive">
                    {appliance.dailyConsumption.toFixed(1)} kWh/day
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inductive Loads Warning */}
      {inductiveLoads.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Zap className="h-5 w-5" />
              Inductive Loads Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700 mb-3">
              These inductive loads require 4x surge capacity. Consider:
            </p>
            <div className="space-y-2">
              {inductiveLoads.map((appliance) => (
                <div key={appliance.id} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-medium">{appliance.name}</span>
                  <Badge variant="destructive">
                    {appliance.surgeFactor}W surge
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-white rounded">
              <p className="text-sm text-red-700">
                <strong>Recommendation:</strong> Use soft-start devices or variable frequency drives (VFDs) 
                to reduce starting current for motors and compressors.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {optimizationTips.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.icon}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            System Optimization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Potential Energy Savings</p>
              <p className="text-2xl font-bold text-green-600">
                {(energyData.totalRawEnergy * 0.2).toFixed(1)} kWh
              </p>
              <p className="text-xs text-gray-500">Through efficiency measures</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">System Efficiency</p>
              <p className="text-2xl font-bold text-blue-600">
                {batteryInputs.batteryType === "lithium" ? "85%" : "75%"}
              </p>
              <p className="text-xs text-gray-500">Overall system efficiency</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold text-purple-600">3-5 years</p>
              <p className="text-xs text-gray-500">Estimated ROI timeframe</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};