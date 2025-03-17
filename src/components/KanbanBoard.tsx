import * as React from 'react';
import {
  TaskBoard,
  TaskBoardToolbar,
  TaskBoardChangeEvent,
  TaskBoardColumnModel,
  TaskBoardTaskModel,
  TaskBoardPriority
} from '@progress/kendo-react-taskboard';
import { Button } from '@progress/kendo-react-buttons';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import { CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { Column } from './kanban/Column';
import { Card } from './kanban/Card';
import { cards } from '../types/Cards';
import { plusIcon } from '@progress/kendo-svg-icons';

const tasks: TaskBoardTaskModel[] = cards.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  status: c.status,
  priority: c.priority
}));

const columns: TaskBoardColumnModel[] = [
  { id: 1, title: 'To-Do', status: 'todo' },
  { id: 2, title: 'In Progress', status: 'inProgress' },
  { id: 3, title: 'Done', status: 'done' }
];

const priorities: TaskBoardPriority[] = [
  { priority: 'Low Priority', color: 'green' },
  { priority: 'High Priority', color: 'blue' },
  { priority: 'Urgent', color: 'orange' }
];

const KanbanBoard = () => {
  const [filter, setFilter] = React.useState<string>('');
  const [taskData, setTaskData] = React.useState<TaskBoardTaskModel[]>(tasks);
  const [columnsData, setColumnsData] = React.useState<TaskBoardColumnModel[]>(columns);

  const onSearchChange = React.useCallback((event: InputChangeEvent) => {
      setFilter(event.value);
  }, []);

  const resultTasks = React.useMemo(() => {
      const filterDesc: CompositeFilterDescriptor = {
          logic: 'and',
          filters: [{ field: 'title', operator: 'contains', value: filter }]
      };
      return filter ? filterBy(taskData, filterDesc) : taskData;
  }, [filter, taskData]);

  const onChangeHandler = React.useCallback((event: TaskBoardChangeEvent) => {
      if (event.type === 'column') {
          setColumnsData(event.data as TaskBoardColumnModel[]);
      } else {
          // New Task has been added.
          if (event.item && event.item.id === undefined) {
              event.item.id = event.data.length + 1;
          }
          setTaskData(event.data as TaskBoardTaskModel[]);
      }
  }, []);

  const onAddColumn = () => {
      const newColumn: TaskBoardColumnModel = {
          id: columnsData.length + 1,
          title: 'New Column',
          status: 'new',
          edit: true
      };
      setColumnsData([...columnsData, newColumn]);
  };

  return (
      <TaskBoard
          columnData={columnsData}
          taskData={resultTasks}
          priorities={priorities}
          onChange={onChangeHandler}
          column={Column}
          card={Card}
          style={{ height: '700px' }}
          tabIndex={0}
      >
          <TaskBoardToolbar>
              <Button 
               className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
              svgIcon={plusIcon} onClick={onAddColumn}>
                  테스크 추가하기
              </Button>
              <span className="k-spacer" />
              <Input placeholder="Search..." onChange={onSearchChange} value={filter} />
          </TaskBoardToolbar>
      </TaskBoard>
  );
};

export default KanbanBoard;