'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import RegistroPersonal from './RegistroPersonal';

// Basic tabs implementation
const BasicTabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

const BasicTabs = ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <BasicTabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </BasicTabsContext.Provider>
  );
};

const BasicTab = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(BasicTabsContext);
  const isActive = context?.activeTab === value;
  return <div className={isActive ? 'block' : 'hidden'}>{children}</div>;
};

const BasicTabsList = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex border-b mb-4">{children}</div>;
};

const BasicTabsTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(BasicTabsContext);
  const isActive = context?.activeTab === value;

  return (
    <button
      className={`px-4 py-2 font-medium ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
      onClick={() => context?.setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const BasicTabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const context = React.useContext(BasicTabsContext);
  const isActive = context?.activeTab === value;
  return isActive ? <div>{children}</div> : null;
};

interface ProjectData {
  id: string;
  name: string;
  dailyTasks?: any[];
  devTasks?: any[];
}

interface PanelDeActividadesProps {
  projectId: string;
  projectData: ProjectData;
}

const PanelDeActividades: React.FC<PanelDeActividadesProps> = ({ projectId, projectData }) => {
  const { address: userAddress } = useAppContext();

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Panel de Actividades</h2>
        <p className="text-sm text-gray-600">Gestión de tareas y seguimiento del proyecto</p>
      </div>

      <BasicTabs defaultValue="tareas">
        <BasicTabsList>
          <BasicTabsTrigger value="tareas">Tareas del Proyecto</BasicTabsTrigger>
          <BasicTabsTrigger value="registro">Mi Registro Personal</BasicTabsTrigger>
          <BasicTabsTrigger value="dev">Dev Tasks</BasicTabsTrigger>
        </BasicTabsList>
        <BasicTabsContent value="tareas">
          <TareasProyectoStub
            dailyTasks={projectData.dailyTasks || []}
            projectId={projectId}
          />
        </BasicTabsContent>
        <BasicTabsContent value="registro">
          <RegistroPersonal
            projectId={projectId}
            userAddress={userAddress || ''}
          />
        </BasicTabsContent>
        <BasicTabsContent value="dev">
          <DevTasksStub
            devTasks={projectData.devTasks || []}
            projectId={projectId}
          />
        </BasicTabsContent>
      </BasicTabs>
    </div>
  );
};

// Enhanced tasks component with expand/collapse functionality
const TareasProyectoStub: React.FC<{ dailyTasks: any[], projectId: string }> = ({ dailyTasks, projectId }) => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [taskStates, setTaskStates] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    // Initialize task states from stored data if available
    const initialStates = new Map();
    dailyTasks?.forEach(task => {
      initialStates.set(task.id, task.completed || false);
    });
    setTaskStates(initialStates);
  }, [dailyTasks]);

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleCompleted = (taskId: string) => {
    setTaskStates(prev => {
      const newStates = new Map(prev);
      newStates.set(taskId, !prev.get(taskId));
      return newStates;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tareas del Proyecto</h3>
        <span className="text-sm text-gray-500">
          {dailyTasks?.length || 0} tareas
        </span>
      </div>

      {dailyTasks?.length > 0 ? (
        dailyTasks.map((task, index) => {
          const taskId = task.id || `task_${index}`;
          const isExpanded = expandedTasks.has(taskId);
          const isCompleted = taskStates.get(taskId) || false;

          return (
            <div key={taskId} className={`border rounded-lg overflow-hidden transition-all duration-200 ${
              isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
            }`}>
              {/* Task Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleCompleted(taskId)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <h4 className={`text-sm font-medium transition-colors ${
                      isCompleted ? 'text-green-800 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => toggleExpanded(taskId)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    title={isExpanded ? "Colapsar" : "Expandir"}
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {task.description && (
                      <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                        {task.description}
                      </p>
                    )}

                    {task.links && task.links.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Enlaces relacionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.links.map((link: any, linkIndex: number) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 010-1.5v.5A2.25 2.25 0 0010.25 9v6.75c0 .621-.504 1.125-1.125 1.125H3a1.125 1.125 0 01-1.125-1.125V6.75A2.25 2.25 0 004.25 4.5h5.5a.75.75 0 010 1.5H4.25z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M12.5 4.5a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0V4.5zm-1.5 6a.75.75 0 00.75-.75V8a.75.75 0 000-1.5H9.5a.75.75 0 000 1.5h.75v1a2.25 2.25 0 004.5 0 .75.75 0 000-1.5 2.25 2.25 0 000-4.5H9.5a3.75 3.75 0 000 7.5h.75a.75.75 0 00.75-.75z" clipRule="evenodd" />
                              </svg>
                              {link.label || 'Ver enlace'}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">No hay tareas asignadas</p>
          <p className="text-gray-400 text-sm mt-1">Las tareas diarias se configuran desde la administración del proyecto</p>
        </div>
      )}

      {/* Progress Summary */}
      {dailyTasks?.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Progreso del Proyecto</h4>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              Completadas: {Array.from(taskStates.values()).filter(Boolean).length} de {dailyTasks.length}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(Array.from(taskStates.values()).filter(Boolean).length / dailyTasks.length) * 100}%`
                }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{Math.round((Array.from(taskStates.values()).filter(Boolean).length / dailyTasks.length) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

const RegistroPersonalStub: React.FC<{ projectId: string, userAddress: string }> = ({ projectId, userAddress }) => {
  return (
    <div className="space-y-4">
      <div className="text-gray-600 text-sm">
        <p>Registro personal para el proyecto</p>
        <p className="text-xs mt-1">Proyecto ID: {projectId}</p>
        <p className="text-xs">Usuario: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
      </div>
      <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50 text-gray-500">
        Área para tu registro personal de actividades.
        (Implementación pendiente)
      </div>
    </div>
  );
};

const DevTasksStub: React.FC<{ devTasks: any[], projectId: string }> = ({ devTasks, projectId }) => {
  return (
    <div className="space-y-3">
      {devTasks.length > 0 ? (
        devTasks.map((task, index) => (
          <div key={task.id || index} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded ${
                task.type === 'setup' ? 'bg-blue-100 text-blue-700' :
                task.type === 'guide' ? 'bg-green-100 text-green-700' :
                task.type === 'code' ? 'bg-purple-100 text-purple-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {task.type || 'task'}
              </span>
            </div>
            <h4 className="font-medium text-gray-900">{task.title}</h4>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{task.content}</p>
            {task.links && task.links.length > 0 && (
              <div className="mt-2 space-x-2">
                {task.links.map((link: any, linkIndex: number) => (
                  <a key={linkIndex} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hay tareas de desarrollo configuradas para este proyecto
        </div>
      )}
    </div>
  );
};

export default PanelDeActividades;
