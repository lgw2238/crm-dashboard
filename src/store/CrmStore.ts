import { create } from 'zustand';
import { Customer, Table, Task } from '../types/Crm';

interface CRMState {
  tables: Table[];
  tasks: Task[];
  addTable: () => void;
  deleteTable: (tableId: number) => void;
  updateTableName: (tableId: number, name: string) => void;
  updateCustomer: (tableId: number, customer: Customer) => void;
  addCustomer: (tableId: number) => void;
  deleteCustomers: (tableId: number, customerIds: number[]) => void;
  updateTask: (task: Task) => void;
}

// dummy data
const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "John Doe",
    company: "Tech Corp",
    email: "john@techcorp.com",
    phone: "123-456-7890",
    status: "New",
    priority: "High",
    lastContact: new Date(),
    notes: "Initial contact made"
  },
  {
    id: 2,
    name: "Jane Smith",
    company: "Design Co",
    email: "jane@designco.com",
    phone: "098-765-4321",
    status: "In Progress",
    priority: "Medium",
    lastContact: new Date(),
    notes: "Following up next week"
  },
  {
    id: 3,
    name: "Rose Johnson",
    company: "Mobile Corp",
    email: "rose@designco.com",
    phone: "158-225-5421",
    status: "Closed",
    priority: "Low",
    lastContact: new Date(),
    notes: "Following up next week"
  },
  {
    id: 4,
    name: "Ann Brown",
    company: "nono Co",
    email: "ann@designco.com",
    phone: "151-513-1222",
    status: "In Progress",
    priority: "Medium",
    lastContact: new Date(),
    notes: "Following up next week"
  }
];

const today = new Date();
const oneDay = 24 * 60 * 60 * 1000;

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Website Redesign Project",
    description: "Complete overhaul of client website",
    status: "In Progress",
    priority: "High",
    assignee: "Alice",
    startDate: new Date(today.getTime() - 2 * oneDay),
    endDate: new Date(today.getTime() + 5 * oneDay),
    percentComplete: 35
  },
  {
    id: 2,
    title: "Marketing Campaign",
    description: "Q2 Marketing Initiative",
    status: "To Do",
    priority: "Medium",
    assignee: "Bob",
    startDate: new Date(today.getTime() + oneDay),
    endDate: new Date(today.getTime() + 7 * oneDay),
    percentComplete: 0
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "Prepare and deliver final presentation",
    status: "Done",
    priority: "High",
    assignee: "Charlie",
    startDate: new Date(today.getTime() - 5 * oneDay),
    endDate: new Date(today.getTime() - oneDay),
    percentComplete: 100
  },
  {
    id: 4,
    title: "Product Launch",
    description: "New feature release",
    status: "In Progress",
    priority: "High",
    assignee: "David",
    startDate: new Date(today.getTime()),
    endDate: new Date(today.getTime() + 10 * oneDay),
    percentComplete: 60
  },
  {
    id: 5,
    title: "Team Training",
    description: "Technical skills workshop",
    status: "To Do",
    priority: "Medium",
    assignee: "Eve",
    startDate: new Date(today.getTime() + 3 * oneDay),
    endDate: new Date(today.getTime() + 4 * oneDay),
    percentComplete: 0
  }
];

export const useCRMStore = create<CRMState>((set) => ({
  tables: [
    {
      id: 1,
      name: 'Default Table',
      customers: initialCustomers,
    },
  ],
  tasks: initialTasks,
  addTable: () =>
    set((state) => ({
      tables: [
        ...state.tables,
        {
          id: state.tables.length + 1,
          name: `Table ${state.tables.length + 1}`,
          customers: [],
        },
      ],
    })),
  deleteTable: (tableId) =>
    set((state) => ({
      tables: state.tables.filter((table) => table.id !== tableId),
    })),
  updateTableName: (tableId, name) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId ? { ...table, name } : table
      ),
    })),
  updateCustomer: (tableId, customer) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              customers: table.customers.map((c) =>
                c.id === customer.id ? customer : c
              ),
            }
          : table
      ),
    })),
  addCustomer: (tableId) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              customers: [
                ...table.customers,
                {
                  id: Math.max(0, ...table.customers.map(c => c.id)) + 1,
                  name: "",
                  company: "",
                  email: "",
                  phone: "",
                  status: "New",
                  priority: "Medium",
                  lastContact: new Date(),
                  notes: ""
                }
              ],
            }
          : table
      ),
    })),
  deleteCustomers: (tableId, customerIds) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              customers: table.customers.filter(
                (customer) => !customerIds.includes(customer.id)
              ),
            }
          : table
      ),
    })),
  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    })),
}));