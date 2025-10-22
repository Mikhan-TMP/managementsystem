"use client";

import React, { useState } from 'react';
import { Button } from '../../components/ui/buttons';
import { File, Folder, List, Notebook, ReceiptText, User2, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar } from 'recharts';

export default function DashboardContent() {
    return(

        <div className="mt-6  w-full">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">
                Welcome to your centralized command center where you can monitor key metrics, track ongoing activities, and access all your essential tools in one place.
            </p>
            {/* Small Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                <SmallCard 
                    titles={["Total Employees", "Departments"]} 
                    values={["0", "0"]} 
                    icons={[
                        <Users key="users" size={24} color="white" />,
                        <Folder key="folder" size={24} color="white" />
                    ]}
                />
                <SmallCard 
                    titles={["Attendance Rate", "Reports Generated"]} 
                    values={["0%", "0"]} 
                    icons={[
                        <Notebook key="notebook" size={24} color="white" />,
                        <ReceiptText key="receipt" size={24} color="white" />
                    ]}
                />
                <SmallCard 
                    titles={["Pending Projects", "Late Tasks"]} 
                    values={["0", "0"]} 
                    icons={[
                        <File key="file" size={24} color="white" />,
                        <List key="list" size={24} color="white" />
                    ]}
                />
            </div>
            {/* Graph Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <GraphCard 
                    title="Employment Overview"
                    data = {[
                        { name: 'Jan', value: 400 },
                        { name: 'Feb', value: 300 },
                        { name: 'Mar', value: 600 },
                        { name: 'Apr', value: 800 },
                        { name: 'May', value: 500 },
                        { name: 'Jun', value: 700 },
                    ]}
                    type="line"
                    />
                <GraphCard
                    title="Attendance Overview"
                    data = {(() => {
                        const data = [];
                        for (let i = 5; i >= 0; i--) {
                            const date = new Date();
                            date.setDate(date.getDate() - i);
                            data.push({
                                name: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
                                value: Math.floor(Math.random() * (95 - 75 + 1))
                            });
                        }
                        return data;
                    })()}
                    type="bar"
                    />
                    <GraphCard 
                        title="Project Overview"
                        data={[
                            { name: 'Completed', value: 45 },
                            { name: 'In Progress', value: 30 },
                            { name: 'Pending', value: 15 },
                            { name: 'On Hold', value: 10 }
                        ]}
                        type="radar"
                    />
            </div>
            {/* Table Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <TableCard 
                    title="Recent Employee Activities"
                    columns={["Employee", "Activity", "Date"]}
                    data={[
                        ["John Doe", "Logged In", "2024-06-01"],
                        ["Jane Smith", "Submitted Report", "2024-06-01"],
                        ["Mike Johnson", "Updated Profile", "2024-05-31"],
                        ["Emily Davis", "Logged Out", "2024-05-31"],
                    ]}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <EventsCard 
                        icons={[
                            <User2 key="event1" size={24} color="white" />,
                            <List key="event2" size={24} color="white" />,
                            <Notebook key="event3" size={24} color="white" />
                            
                        ]}
                        titles={["Team Meeting", "Project Deadline", "HR Workshop"]}
                        dates={["2024-06-05 10:00 AM", "2024-06-10 11:59 PM", "2024-06-12 03:00 PM"]}
                    />
                    <DepartmentCard 
                        icons={[
                            <Folder key="dept1" size={24} color="white" />,
                            <Users key="dept2" size={24} color="white" />,
                            <ReceiptText key="dept3" size={24} color="white" />
                        ]}
                        titles={["Human Resources", "Development", "Marketing"]}
                        descriptions={["Managing employee relations", "Building software solutions", "Promoting our brand"]}

                    />  
                </div>
                <TableCard 
                    title="Task Summary"
                    columns={["Task", "Status", "Due Date"]}
                    data={[
                        ["Design Homepage", "In Progress", "2024-06-07"],
                        ["Implement Authentication", "Completed", "2024-06-01"],
                        ["Set Up Database", "Pending", "2024-06-10"],
                        ["Write Documentation", "In Progress", "2024-06-15"],
                    ]}
                />
            </div>

 
        </div>

    )
}

//small cards design
function SmallCard({ titles, values, icons }: { titles: string[]; values: string[]; icons: React.ReactNode[] }) {
    return (
        <div className="p-4 rounded-lg bg-white/10 shadow-lg flex flex-row justify-between items-center">
            {titles.map((title: string, index: number) => (
                <div key={index} className="flex items-center space-x-4 select-none">
                    <div className="p-3 bg-blue-700/30 rounded-lg shadow-md ">
                        {icons[index]}
                    </div>
                    <div>
                        <p className="text-xl font-bold">{values[index]}</p>
                        <h3 className="text-sm font-medium">{title}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

// graph cards
function GraphCard({ title, data, type }: { title: string, data?: any[], type: 'line' | 'bar' | 'pie' | 'radar' | 'radialBar' }) {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    return (
        <div className="p-4 rounded-lg bg-white/10 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            {!data || data.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500">No data available</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={160}>
                    {type === 'line' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                            <YAxis stroke="rgba(255,255,255,0.6)" />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    ) : type === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                            <YAxis stroke="rgba(255,255,255,0.6)" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    ) : type === 'pie' ? (
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                                outerRadius={60}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    ) : type === 'radar' ? (
                        <RadarChart data={data}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                            <PolarRadiusAxis stroke="rgba(255,255,255,0.4)" />
                            <Radar name="Projects" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    ) : type === 'radialBar' ? (
                        <RadialBarChart 
                            innerRadius="10%" 
                            outerRadius="80%" 
                            data={data} 
                            startAngle={180} 
                            endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar 
                                background 
                                dataKey="value" 
                                cornerRadius={10}
                                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </RadialBar>
                            <Tooltip />
                        </RadialBarChart>
                    ) : (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-gray-500">Chart type not implemented</p>
                        </div>
                    )}
                </ResponsiveContainer>
            )}
        </div>
    );
}
//Table Cards
function TableCard({title, columns, data}: {title: string, columns: string[], data: string[][]}) {
    return (
        <div className="p-4 rounded-lg bg-white/10 shadow-lg">
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="border-b border-gray-300/50 px-4 py-2 text-left">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? '' : ''}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="border-b border-gray-300/50 px-2 py-2">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EventsCard({ icons, titles, dates }: { icons: React.ReactNode[]; titles: string[]; dates: string[] }) {
    return (
        <div className="p-4 rounded-lg bg-white/10 shadow-lg">
            <h3 className="text-lg font-bold  mb-4">Upcoming Events</h3>
            <ul>
                <li className="flex flex-col mb-4">
                    {titles.map((title, index) => (
                        <div key={index} className="flex items-center space-x-4 select-none mb-3">
                            <div className="p-3 bg-yellow-500/50 rounded-lg shadow-md "> 
                                {icons[index]}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{title}</p>
                                <p className="text-xs text-gray-500">{dates[index]}</p>
                            </div>
                        </div>
                    ))}
                </li>

            </ul>
        </div>
    );
}


function DepartmentCard({ icons, titles, descriptions }: { icons: React.ReactNode[]; titles: string[]; descriptions: string[] }) {
    return (
        <div className="p-4 rounded-lg bg-white/10 shadow-lg">
            <h3 className="text-lg font-bold  mb-4">Active Departments</h3>
            <ul>
                <li className="flex flex-col mb-4">
                    {titles.map((title, index) => (
                        <div key={index} className="flex items-center space-x-4 select-none mb-3">
                            <div className="p-3 bg-yellow-500/50 rounded-lg shadow-md "> 
                                {icons[index]}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{title}</p>
                                <p className="text-xs text-gray-500">{descriptions[index]}</p>
                            </div>
                        </div>
                    ))}
                </li>

            </ul>
        </div>
    );
}

