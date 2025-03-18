import React, { useState } from 'react';
import {
  Grid,
  GridColumn,
  GridDataStateChangeEvent,
  GridCellProps,
  GridColumnReorderEvent
} from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Popup } from '@progress/kendo-react-popup';
import { orderBy, filterBy, CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { useCRMStore } from '../store/CrmStore';
import { Customer, ColumnConfig } from '../types/Crm';
import { Pencil, Trash2, MoreVertical, Plus, Columns } from 'lucide-react';
import { DatePicker } from '@progress/kendo-react-dateinputs';

const StatusCell = (props: GridCellProps) => {
  const { dataItem, field = '' } = props;
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-green-100 text-green-800'
  };

  const statuses = ['New', 'In Progress', 'Closed'];

  if (dataItem.inEdit) {
    return (
      <td>
        <DropDownList
          style={{ width: "100%" }}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange({
                dataItem,
                field,
                value: e.target.value,
                syntheticEvent: e.nativeEvent || e
              });
            }
          }}
          value={dataItem[field] || ''}
          data={statuses}
        />
      </td>
    );
  }

  return (
    <td>
      <span className={`px-2 py-1 rounded-full text-sm ${field && statusColors[dataItem[field] as keyof typeof statusColors]}`}>
        {field && dataItem[field]}
      </span>
    </td>
  );
};

const PriorityCell = (props: GridCellProps) => {
  const { dataItem, field = '' } = props;
  const priorityColors = {
    'High': 'bg-red-100 text-yellow-800',
    'Medium': 'bg-blue-100 text-green-800',
    'Low': 'bg-yellow-100 text-green-800'
  };


  const priorities = ['Low', 'Medium', 'High'];

  if (dataItem.inEdit) {
    return (
      <td>
        <DropDownList
          style={{ width: "100%" }}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange({
                dataItem,
                field,
                value: e.target.value,
                syntheticEvent: e.nativeEvent || e
              });
            }
          }}
          value={dataItem[field]}
          data={priorities}
        />
      </td>
    );
  }

  return (
    <td>
      <span className={`px-2 py-1 rounded-full text-sm ${field && priorityColors[dataItem[field] as keyof typeof priorityColors]}`}>
      {field && dataItem[field]}
      </span>
    </td>
  );
};

const CheckboxCell = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <td className="text-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
    </td>
  );
};

const CheckboxHeader = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
    />
  );
};

const EditableCell = (props: GridCellProps) => {
  const { dataItem, field = '' } = props;
  const { updateCustomer } = useCRMStore();
  const tableId = (dataItem as any).tableId || 1; // 기본값 설정

  if (dataItem.inEdit) {
    return (
      <td>
        <input
          type="text"
          className="k-input w-full"
          value={dataItem[field] || ''}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange({
                dataItem: {
                  ...dataItem,
                  inEdit: true // 편집 상태 유지
                },
                field,
                value: e.target.value,
                syntheticEvent: e,
                dataIndex: dataItem.index
              });
            }
          }}
          onBlur={(e) => {
            // 클릭된 요소가 같은 row 내부가 아닐 경우에만 편집 종료
            const clickedElement = e.relatedTarget;
            const currentRow = e.currentTarget.closest('tr');
            
            if (!clickedElement || !currentRow?.contains(clickedElement)) {
              updateCustomer(tableId, { ...dataItem, inEdit: false });
            }
          }}
        />
      </td>
    );
  }
  return <td>{dataItem[field]}</td>;
};

const DateCell = (props: GridCellProps) => {
  const { dataItem, field = '' } = props;
  const { updateCustomer } = useCRMStore();
  const tableId = (dataItem as any).tableId || 1; // 기본값 설정

  if (dataItem.inEdit) {
    return (
      <td>
        <DatePicker
          value={new Date(dataItem[field])}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange({
                dataItem,
                field,
                value: e.value,
                syntheticEvent: e.syntheticEvent,
                dataIndex: dataItem.index // 필수 dataIndex 속성 추가
              });
            }
          }}
          onBlur={() => {
            if (props.onChange) {
              props.onChange({
                dataItem,
                field,
                value: dataItem[field],
                syntheticEvent: null as any,
                dataIndex: dataItem.index // dataIndex 추가
              });
            }
            updateCustomer(tableId, { ...dataItem, inEdit: false });
          }}
          format="yyyy-MM-dd"
        />
      </td>
    );
  }
  return <td>{new Date(dataItem[field]).toLocaleDateString()}</td>;
};

interface SingleGridProps {
  tableId: number;
  customers: Customer[];
}

const SingleGrid: React.FC<SingleGridProps> = ({ tableId, customers }) => {
  const { updateCustomer, addCustomer, deleteCustomers } = useCRMStore();
  const [sort, setSort] = useState<Array<SortDescriptor>>([]);
  const [filter, setFilter] = useState<CompositeFilterDescriptor>({
    logic: 'and',
    filters: [],
  });
  const [selectedCustomers, setSelectedCustomers] = useState<Set<number>>(new Set());
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const columnMenuAnchor = React.useRef<HTMLButtonElement>(null);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { field: 'name', title: 'Name', width: '150px', show: true , cell: EditableCell},
    { field: 'company', title: 'Company', width: '150px', show: true , cell: EditableCell},
    { field: 'email', title: 'Email', width: '200px', show: true , cell: EditableCell},
    { field: 'phone', title: 'Phone', width: '150px', show: true , cell: EditableCell},
    { field: 'status', title: 'Status', width: '120px', show: true, cell: StatusCell },
    { field: 'priority', title: 'Priority', width: '120px', show: true, cell: PriorityCell },
    { field: 'lastContact', title: 'Last Contact', width: '150px', show: true, editor: 'date' as 'date', format: '{0:d}' , cell : DateCell },
    { field: 'notes', title: 'Notes', width: '200px', show: true , cell: EditableCell},
  ]);

  const handleGridDataStateChange = (e: GridDataStateChangeEvent) => {
    setSort(e.dataState.sort || []);
    setFilter(e.dataState.filter || { logic: 'and', filters: [] });
  };

  const handleItemChange = (e: any) => {
    const { dataItem, field, value } = e;
    const updatedItem = { 
      ...dataItem,
      [field]: value,
      // inEdit: false  // 이 줄을 제거
    };
    updateCustomer(tableId, updatedItem);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === customers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(customers.map(c => c.id)));
    }
  };

  const handleSelectCustomer = (customerId: number) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedCustomers.size > 0) {
      deleteCustomers(tableId, Array.from(selectedCustomers));
      setSelectedCustomers(new Set());
    }
  };

  const handleCellClick = (e: any) => {
    if (e.dataItem && !e.dataItem.inEdit) {
      // 다른 행의 편집 모드를 모두 종료
      customers.forEach(customer => {
        if ((customer as any).inEdit) {
          updateCustomer(tableId, { ...customer, inEdit: false });
        }
      });
      // 클릭한 행만 편집 모드로 변경
      updateCustomer(tableId, { ...e.dataItem, inEdit: true });
    }
  };

  // 각 고객 데이터에 tableId 추가
  const customersWithTableId = customers.map(customer => ({
    ...customer,
    tableId
  }));

  const handleColumnReorder = (e: GridColumnReorderEvent) => {
    const newColumns = [...columns];
    const item = newColumns.splice(e.oldIndex - 1, 1)[0];
    newColumns.splice(e.newIndex - 1, 0, item);
    setColumns(newColumns);
  };

  const toggleColumnVisibility = (field: string) => {
    setColumns(columns.map(col => 
      col.field === field ? { ...col, show: !col.show } : col
    ));
  };

  const data = orderBy(
    filterBy(customersWithTableId, filter),
    sort
  );

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => addCustomer(tableId)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
        >
          Add Row
        </button>
        <button
            ref={columnMenuAnchor}
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <Columns size={16} />
            Manage Columns
        </button>
        {selectedCustomers.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Selected ({selectedCustomers.size})
          </button>
        )}
      </div>
      <Popup
        anchor={columnMenuAnchor.current}
        show={showColumnMenu}
        popupClass="bg-white rounded-lg shadow-lg p-4 w-64"
        onClose={() => setShowColumnMenu(false)}
      >
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 mb-3">Visible Columns</h3>
          {columns.map((column) => (
            <div key={column.field} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={column.show}
                onChange={() => toggleColumnVisibility(column.field)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{column.title}</span>
            </div>
          ))}
        </div>
      </Popup>
      <Grid
        data={data}
        sortable={true}
        filterable={false}
        reorderable={true}
        onColumnReorder={handleColumnReorder}
        onDataStateChange={handleGridDataStateChange}
        onItemChange={handleItemChange}
        onRowClick={handleCellClick}
        editField="inEdit"
        className="h-full"
      >
        <GridColumn
          width="50px"
          title=" "
          headerCell={() => (
            <div className="text-center">
              <CheckboxHeader
                checked={selectedCustomers.size === customers.length}
                onChange={handleSelectAll}
              />
            </div>
          )}
          cell={(props) => (
            <CheckboxCell
              checked={selectedCustomers.has(props.dataItem.id)}
              onChange={() => handleSelectCustomer(props.dataItem.id)}
            />
          )}
        />
         {columns.filter(col => col.show).map((column) => (
          <GridColumn
            key={column.field}
            field={column.field}
            title={column.title}
            width={column.width}
            cell={column.cell}
            editor={column.editor}
            format={column.format}
          />
        ))}
        {/* <GridColumn 
          field="name" 
          title="Name" 
          width="150px"
          cell={EditableCell}
        />
        <GridColumn 
          field="company" 
          title="Company" 
          width="150px"
          cell={EditableCell}
        />
        <GridColumn 
          field="email" 
          title="Email" 
          width="200px"
          cell={EditableCell}
        />
        <GridColumn 
          field="phone" 
          title="Phone" 
          width="150px"
          cell={EditableCell}
        />
        <GridColumn 
          field="status" 
          title="Status" 
          width="120px" 
          cell={StatusCell}
        />
        <GridColumn 
          field="priority" 
          title="Priority" 
          width="120px" 
          cell={PriorityCell}
        />
        <GridColumn 
          field="lastContact" 
          title="Due date" 
          width="150px" 
          cell={DateCell}
          format="{0:d}"
        />
        <GridColumn 
          field="notes" 
          title="Notes" 
          width="200px"
          cell={EditableCell}
        /> */}
      </Grid>
    </div>
  );
};

interface TableHeaderProps {
  tableId: number;
  name: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ tableId, name }) => {
  const { updateTableName, deleteTable } = useCRMStore();
  const [isEditing, setIsEditing] = useState(false);
  const [tableName, setTableName] = useState(name);
  const [showMenu, setShowMenu] = useState(false);
  const menuAnchor = React.useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTableName(tableId, tableName);
    setIsEditing(false);
  };

  const handleDeleteTable = () => {
    deleteTable(tableId);
    setShowMenu(false);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button
          ref={menuAnchor}
          onClick={() => setShowMenu(!showMenu)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={16} />
        </button>
        <Popup
          anchor={menuAnchor.current}
          show={showMenu}
          popupClass="bg-white rounded-lg shadow-lg py-1 w-48"
          onClose={() => setShowMenu(false)}
        >
          <div className="py-1">
            <button
              onClick={handleDeleteTable}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete Table
            </button>
          </div>
        </Popup>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Save
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CRMGrid: React.FC = () => {
  const { tables, addTable } = useCRMStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addTable}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
        >
          Add Table
        </button>
      </div>
      {tables.map((table) => (
        <div key={table.id} className="bg-white rounded-lg shadow-sm p-6">
          <TableHeader tableId={table.id} name={table.name} />
          <SingleGrid tableId={table.id} customers={table.customers} />
        </div>
      ))}
    </div>
  );
};

export default CRMGrid;