import React, {} from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DashboardChartProps {
  title: string;
  type: "line" | "bar" | "pie";
  data: ChartData[];
  height?: number;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  type,
  data,
  height = 300
}) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  const getIcon = () => {
    switch (type) {
      case "line":
        return <LineChart className="h-5 w-5" />;
      case "bar":
        return <BarChart className="h-5 w-5" />;
      case "pie":
        return <PieChart className="h-5 w-5" />;
      default:
        return <LineChart className="h-5 w-5" />;
    }
  };

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="flex items-end gap-2">
          {type === "bar" &&
            data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || colors[index % colors.length],
                    minHeight: "20px"
                  }}
                />
                <span className="text-xs text-muted-foreground truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            ))}

          {type === "pie" && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative w-48 h-48">
                {data.map((item, index) => {
                  const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100;
                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${item.color || colors[index % colors.length]} ${percentage}%, transparent 0)`,
                        transform: `rotate(${data.slice(0, index).reduce((sum, d) => sum + (d.value / data.reduce((s, x) => s + x.value, 0)) * 360, 0)}deg)`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {type === "line" && (
            <div className="w-full h-full flex items-end gap-1">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-2 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      minHeight: "10px"
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
