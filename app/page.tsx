'use client'

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnergyAudit } from "@/components/energyAudit";
import { BatteryDesign } from "@/components/batteryDesign";
import { PVDesign } from "@/components/pvDesign";
import { InverterCalculator } from "@/components/inverterCalculator";
import Recommendations from "@/components/recommendations";
import { ChatInterface } from "@/components/chatInterface";
import { useAppStore } from "@/store/useAppStore";
import { Calculator, Battery, Sun, Zap, MessageCircle, Sparkles } from "lucide-react"; // Removed History

const Index = () => {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image src="/logo.png" 
                    height={42}
                    width={42}
                    alt="Solar Master Logo" 
                    className="h-12 w-12 rounded-full shadow-md" />
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
              <Sun className="h-8 w-8 text-yellow-500" />
              Solar Master
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Design, Analyze, and Optimize Your Entire Solar Installation in Minutes!!
          </p>
        </div>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2"> */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="energy-audit" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Energy Audit</span> 
            </TabsTrigger>

            <TabsTrigger value="battery-design" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Battery className="h-4 w-4" />
              <span className="hidden sm:inline">Battery Design</span>
            </TabsTrigger>

            <TabsTrigger value="pv-design" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">PV Design</span> 
            </TabsTrigger>

            <TabsTrigger value="inverter" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Inverter</span> 
            </TabsTrigger>

            <TabsTrigger value="recommendation" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendation</span> 
            </TabsTrigger>

            <TabsTrigger value="chat" className="flex items-center justify-center gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span> 
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
          </TabsContent>

          <TabsContent value="recommendation">
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Get personalized suggestions on system components and configuration to optimize your solar installation for efficiency, reliability, and cost-effectiveness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Recommendations />
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
