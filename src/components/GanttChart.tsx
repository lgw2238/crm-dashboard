import React from 'react';
import { Gantt } from '@progress/kendo-react-gantt';
import { useCRMStore } from '../store/CrmStore';

const GanttChart: React.FC = () => {
  const { tasks, updateTask } = useCRMStore();

  const columns = [
    { field: 'title', title: 'Task', width: 280 },
    { field: 'assignee', title: 'Assigned To', width: 150 },
    { field: 'status', title: 'Status', width: 100 },
    { field: 'percentComplete', title: 'Progress', width: 100, format: '{0}%' }
  ];

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Gantt
        taskData={tasks.map(task => ({
          id: task.id,
          title: task.title,
          start: task.startDate,
          end: task.endDate,
          percentComplete: task.percentComplete,
          assignee: task.assignee,
          status: task.status
        }))}
        columns={columns}
        navigatable={true}
        onExpandChange={(e: any) => {
          if (e.dataItem) {
            updateTask({
              ...e.dataItem,
              startDate: e.dataItem.start,
              endDate: e.dataItem.end
            });
          }
        }}
      />
    </div>
  );
};

export default GanttChart;