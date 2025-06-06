"use client";

import { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getUserGrowthData, 
  getSessionsByDayData, 
  getTemplateUsageData, 
  getDifficultyDistributionData 
} from "@/actions/report.actions";

// Define types for our data
type UserGrowthData = { period: string; users: number; };
type SessionDayData = { day: string; sessions: number; };
type ChartItemData = { name: string; value: number; };

// Colors for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4a4a4'];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState({
    userGrowth: true,
    sessions: true,
    templates: true,
    difficulty: true
  });

  // Data states with proper typing
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [sessionsByDayData, setSessionsByDayData] = useState<SessionDayData[]>([]);
  const [templateUsageData, setTemplateUsageData] = useState<ChartItemData[]>([]);
  const [difficultyDistributionData, setDifficultyDistributionData] = useState<ChartItemData[]>([]);

  // Fetch data based on selected time range
  useEffect(() => {
    async function fetchData() {
      setIsLoading({
        userGrowth: true,
        sessions: true,
        templates: true,
        difficulty: true
      });
      
      try {
        // Fetch user growth data
        const userData = await getUserGrowthData(timeRange);
        setUserGrowthData(userData);
        setIsLoading(prev => ({ ...prev, userGrowth: false }));
        
        // Fetch sessions by day data
        const sessionsData = await getSessionsByDayData(timeRange);
        setSessionsByDayData(sessionsData);
        setIsLoading(prev => ({ ...prev, sessions: false }));
        
        // Fetch template usage data
        const templatesData = await getTemplateUsageData();
        setTemplateUsageData(templatesData);
        setIsLoading(prev => ({ ...prev, templates: false }));
        
        // Fetch difficulty distribution data
        const difficultyData = await getDifficultyDistributionData();
        setDifficultyDistributionData(difficultyData);
        setIsLoading(prev => ({ ...prev, difficulty: false }));
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    }
    
    fetchData();
  }, [timeRange]);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading.userGrowth ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
                  </div>
                ) : userGrowthData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No user data available for the selected time period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userGrowthData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Template Usage and Difficulty Distribution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Usage</CardTitle>
                <CardDescription>Most popular templates by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {isLoading.templates ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
                    </div>
                  ) : templateUsageData.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      No template usage data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={templateUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {templateUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Sessions`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>Session distribution by difficulty level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {isLoading.difficulty ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
                    </div>
                  ) : difficultyDistributionData.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                      No difficulty distribution data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={difficultyDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {difficultyDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Sessions`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Session Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Session Activity</CardTitle>
              <CardDescription>Number of practice sessions by day of week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading.sessions ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
                  </div>
                ) : sessionsByDayData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-gray-500">
                    No session data available for the selected time period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sessionsByDayData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sessions" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would contain more detailed charts and tables */}
        <TabsContent value="users">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
            <p>More detailed user statistics and charts will be available here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Template Analytics</h2>
            <p>More detailed template usage statistics and charts will be available here.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Session Analytics</h2>
            <p>More detailed practice session statistics and charts will be available here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
} 