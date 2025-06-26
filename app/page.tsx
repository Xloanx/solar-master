'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnergyAudit } from "@/components/energyAudit";
import { BatteryDesign } from "@/components/batteryDesign";
import { PVDesign } from "@/components/pvDesign";
import { InverterCalculator } from "@/components/inverterCalculator";
import { ChargeControllerRecommendation } from "@/components/chargeControllerRecommendation";
import { OptimizationAdvice } from "@/components/optimizationAdvice";
import { ChatInterface } from "@/components/chatInterface";
import { useAppStore } from "@/store/useAppStore";
import { Calculator, Battery, Sun, Zap, MessageCircle } from "lucide-react"; // Removed History

const Index = () => {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Sun className="h-8 w-8 text-yellow-500" />
            Solar Master
          </h1>
          <p className="text-xl text-gray-600">
            Design, Analyze, and Optimize Your Entire Solar Installation in Minutes.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="energy-audit" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Energy Audit
            </TabsTrigger>
            <TabsTrigger value="battery-design" className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              Battery Design
            </TabsTrigger>
            <TabsTrigger value="pv-design" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              PV Design
            </TabsTrigger>
            <TabsTrigger value="inverter" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Inverter
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="energy-audit">
            <Card>
              <CardHeader>
                <CardTitle>Energy Audit</CardTitle>
                <CardDescription>
                  Calculate your total energy consumption by adding appliances and their specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyAudit />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="battery-design">
            <Card>
              <CardHeader>
                <CardTitle>Battery Design</CardTitle>
                <CardDescription>
                  Calculate the number of batteries required for your solar installation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BatteryDesign />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pv-design">
            <Card>
              <CardHeader>
                <CardTitle>Solar Panel Design</CardTitle>
                <CardDescription>
                  Calculate the number of solar panels needed for your installation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PVDesign />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inverter">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inverter Calculator</CardTitle>
                  <CardDescription>
                    Determine the appropriate inverter rating for your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InverterCalculator />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Charge Controller Recommendation</CardTitle>
                  <CardDescription>
                    Get recommendations for the appropriate solar charge controller
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChargeControllerRecommendation />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Advice</CardTitle>
                  <CardDescription>
                    Get suggestions to optimize your installation and reduce costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizationAdvice />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>AI Troubleshooting Assistant</CardTitle>
                <CardDescription>
                  Get expert advice and troubleshooting guidance for your solar installation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
