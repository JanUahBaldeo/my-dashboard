import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

const PipelineBoard = ({
  sensors,
  handleDragStart,
  handleDragEnd,
  handleDragCancel,
  filteredStages,
  getFilteredLeadsForStage,
  metrics,
  isAdmin,
  handleAddLead,
  handleUpdateLead,
  activeLead,
}) => {
  return (
    <div className="p-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToHorizontalAxis]}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 kanban-scrollbar">
          <SortableContext items={filteredStages.map(stage => stage.title)} strategy={verticalListSortingStrategy}>
            {filteredStages.map((stage) => (
              <KanbanColumn
                key={stage.title}
                stage={stage}
                leads={getFilteredLeadsForStage(stage.title)}
                metrics={metrics?.stages?.[stage.title] || {}}
                onAddLead={isAdmin ? (newLead) => handleAddLead(stage.title, newLead) : undefined}
                onUpdateLead={isAdmin ? handleUpdateLead : undefined}
                isAdmin={isAdmin}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeLead ? (
            <KanbanCard lead={activeLead} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {filteredStages.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-xl mb-3 font-medium">
            No pipeline stages found
          </div>
          <div className="text-gray-500 text-sm">
            Try adjusting your filter or check your pipeline configuration.
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineBoard;
