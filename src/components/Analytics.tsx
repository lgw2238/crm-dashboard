import React from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartTitle
} from '@progress/kendo-react-charts';
import { useCRMStore } from '../store/CrmStore';

const Analytics: React.FC = () => {
  const { tasks, tables } = useCRMStore();

  // Calculate task status distribution
  const statusData = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate customer status distribution
  const customerData = tables.reduce((acc, table) => {
    table.customers.forEach(customer => {
      acc[customer.status] = (acc[customer.status] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Chart>
            <ChartTitle text="테스크 현황도" />
            <ChartLegend position="bottom" />
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                data={Object.entries(statusData).map(([status, count]) => ({
                  category: status,
                  value: count
                }))}
                field="value"
                categoryField="category"
              />
            </ChartSeries>
          </Chart>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Chart>
            <ChartTitle text="작업 인입 상태" />
            <ChartLegend position="bottom" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem categories={Object.keys(customerData)} />
            </ChartCategoryAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={Object.values(customerData)}
                color="#3b82f6"
              />
            </ChartSeries>
          </Chart>
        </div>
      </div>
    </div>
  );
};

export default Analytics;