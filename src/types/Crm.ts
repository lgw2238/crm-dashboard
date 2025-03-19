/*
** 컴포넌트 인터페이스 
*/

// export interface Customer {
//   id: number;
//   name: string;
//   owner: JSX.Element;
//   email: string;
//   phone: string;
//   status: 'New' | 'In Progress' | 'Closed';
//   priority: 'Low' | 'Medium' | 'High';
//   lastContact: Date;
//   notes: string;
//   inEdit?: boolean;
// }
// 프로필 및 파일 데이터 프로퍼티 추가
export interface Customer {
  id: number;
  project : string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  lastContact: Date;
  notes: string;
  avatar?: string;
  title?: string;
  department?: string;
  files?: Array<{
    name: string;
    size: number;
    extension: string;
  }>;
}


// 메인테이블의 컬럼 설정을 위한 인터페이스
export interface ColumnConfig {
  field: string;
  title: string;
  width: string;
  show: boolean;
  cell?: (props: any) => JSX.Element;
  editor?: string;
  format?: string;
  isCustom?: boolean;
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