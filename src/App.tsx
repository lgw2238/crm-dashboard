import '@progress/kendo-theme-default/dist/all.css';
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { useState } from "react";
import CrmGrid from './components/CrmGrid';
import KanbanBoard from './components/KanbanBoard';
import { CircleUserRound } from 'lucide-react';
import Analytics from './components/Analytics';
import GanttChart from './components/GanttChart';

function App() {
  const [selected, setSelected] = useState(0);

  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <CircleUserRound className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">CRM Dashboard</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow">
          <TabStrip selected={selected} onSelect={handleSelect}>
            <TabStripTab title="메인 테이블">
              <CrmGrid />
            </TabStripTab>
            <TabStripTab title="칸반 보드">
              <KanbanBoard />
            </TabStripTab>
            <TabStripTab title="간트 차트">
              <GanttChart />
            </TabStripTab>
            <TabStripTab title="그래프">
              <Analytics />
            </TabStripTab>
          </TabStrip>
        </div>
      </main>
    </div>
  );
}

export default App