export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  lastContact: Date;
  notes: string;
  inEdit?: boolean;
}

export interface Table {
  id: number;
  name: string;
  customers: Customer[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High';
  assignee: string;
  startDate?: Date;
  endDate?: Date;
  percentComplete?: number;
}

export interface CrmData {
  id: string;
  title: string;
  description?: string;
  status: string;
  // 기존 CRM 타입에 필요한 필드들을 추가하세요
}