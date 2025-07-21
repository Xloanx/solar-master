'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
//import { useAppStore } from "@/store/useAppStore";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  //const { energyData, pvInputs, batteryInputs } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! I'm your solar installation troubleshooting assistant. I can help you with maintenance issues, system diagnostics, and optimization advice. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // const predefinedResponses = {
  //   "low power output": "Low power output can be caused by several factors:\n\n1. **Shading** - Check for obstructions on panels\n2. **Dirty panels** - Clean panels with water and soft cloth\n3. **Loose connections** - Inspect and tighten all connections\n4. **Inverter issues** - Check inverter display for error codes\n5. **Battery degradation** - Test battery voltage under load\n\nWould you like specific guidance on any of these areas?",
    
  //   "battery not charging": "Battery charging issues troubleshooting:\n\n1. **Check charge controller** - Verify LED indicators\n2. **Verify connections** - Ensure tight, clean connections\n3. **Test battery voltage** - Should be within specifications\n4. **Check solar panel output** - Verify panels are producing power\n5. **Inspect fuses** - Replace any blown fuses\n\nWhat's the current battery voltage reading?",
    
  //   "inverter fault": "Inverter fault diagnosis:\n\n1. **Check error codes** - Note any displayed error messages\n2. **Verify input voltage** - Ensure proper DC voltage from batteries\n3. **Check overload** - Reduce connected loads\n4. **Temperature issues** - Ensure adequate ventilation\n5. **Reset inverter** - Try power cycling the unit\n\nWhat error code is displayed on your inverter?",
    
  //   "system maintenance": "Regular maintenance schedule:\n\n**Monthly:**\n- Visual inspection of all components\n- Clean solar panels\n- Check battery terminals\n\n**Quarterly:**\n- Tighten all connections\n- Test battery specific gravity (flooded batteries)\n- Check charge controller settings\n\n**Annually:**\n- Professional system inspection\n- Replace worn cables\n- Update system monitoring\n\nWhich maintenance task would you like detailed guidance on?",
    
  //   "poor battery life": "Battery life optimization:\n\n1. **Avoid deep discharge** - Keep batteries above 50% SOC\n2. **Regular equalization** - For flooded lead-acid batteries\n3. **Temperature control** - Maintain 20-25°C ambient temperature\n4. **Proper charging** - Ensure complete charge cycles\n5. **Load management** - Avoid prolonged heavy loads\n\nWhat type of batteries are you using?",
  // };

  // const generateResponse = (message: string): string => {
  //   const lowerMessage = message.toLowerCase();
    
  //   // Check for keywords in predefined responses
  //   for (const [key, response] of Object.entries(predefinedResponses)) {
  //     if (lowerMessage.includes(key)) {
  //       return response;
  //     }
  //   }

  //   // General troubleshooting keywords
  //   if (lowerMessage.includes("troubleshoot") || lowerMessage.includes("problem")) {
  //     return "I can help you troubleshoot common solar system issues. Please describe the specific problem you're experiencing:\n\n• Low power output\n• Battery not charging\n• Inverter faults\n• Poor battery life\n• System maintenance\n\nWhat symptoms are you observing?";
  //   }

  //   if (lowerMessage.includes("maintenance")) {
  //     return predefinedResponses["system maintenance"];
  //   }

  //   if (lowerMessage.includes("efficiency") || lowerMessage.includes("optimize")) {
  //     return "System optimization tips:\n\n1. **Panel positioning** - Ensure optimal tilt and orientation\n2. **Shading elimination** - Remove any obstructions\n3. **Load scheduling** - Run high-power loads during peak sun\n4. **Regular cleaning** - Clean panels monthly\n5. **Monitor performance** - Track daily energy production\n\nWhich aspect would you like to optimize?";
  //   }

  //   // Default response
  //   return "I'm here to help with solar installation troubleshooting and maintenance. Could you please provide more specific details about:\n\n• What type of issue you're experiencing\n• What symptoms you've observed\n• When the problem started\n• Any error messages displayed\n\nThis will help me provide more targeted assistance.";
  // };

const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content: inputMessage,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage("");
  setIsLoading(true);

  try {
    const message = { question: inputMessage }; // customize based on backend's expected shape
    // Send user message to backend API
      const res = await fetch("https://solar-master-ai.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Request failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log("Response from backend:", data);
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      console.log("JWT token stored:", data.token);
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: data.response || data.response.tasks_output[0].raw|| "This is default message", // or any relevant response from API
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botResponse]);
  } catch (error) {
    console.error("Error sending user data:", error);

    const errorMessage: Message = {
      id: (Date.now() + 2).toString(),
      type: "bot",
      content: "Sorry, something went wrong while processing your message.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-4 h-96">
      <ScrollArea className="h-80 w-full border rounded-lg p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`p-2 rounded-full ${
                message.type === "user" 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-green-100 text-green-600"
              }`}>
                {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <Card className={`max-w-[80%] ${
                message.type === "user" 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-white border-gray-200"
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="bg-white border-gray-200">
                <CardContent className="p-3">
                  <p className="text-sm text-gray-500">AI is thinking...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Ask about troubleshooting, maintenance, or optimization..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
