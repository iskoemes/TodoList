// src/components/TaskList.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const columns = ['todo', 'in-progress', 'completed'];

function TaskList({ tasks, onUpdate, onDelete, onEdit, selectedIds, onSelectChange, onShowHistory }) {
  const groupedTasks = columns.reduce((acc, status) => ({ ...acc, [status]: tasks.filter(t => t.status === status) }), {});

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const task = tasks.find(t => t.id === result.draggableId);
    if (task) {
      const updated = { ...task, status: result.destination.droppableId };
      onUpdate(updated);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="columns">
        {columns.map(status => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
                <h2>{status.toUpperCase()}</h2>
                {groupedTasks[status].map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskCard
                          task={task}
                          onUpdate={onUpdate}
                          onDelete={onDelete}
                          onEdit={() => onEdit(task)}
                          isSelected={selectedIds.includes(task.id)}
                          onSelect={(checked) => {
                            onSelectChange(checked ? [...selectedIds, task.id] : selectedIds.filter(id => id !== task.id));
                          }}
                          onShowHistory={onShowHistory}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskList;