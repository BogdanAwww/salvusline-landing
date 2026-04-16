import { type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useIsMobile from "../hooks/useIsMobile";

/* ── drag handle icon (6-dot grip) ── */
function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#555" style={{ flexShrink: 0 }}>
      <circle cx="5" cy="3" r="1.5" />
      <circle cx="11" cy="3" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="11" cy="8" r="1.5" />
      <circle cx="5" cy="13" r="1.5" />
      <circle cx="11" cy="13" r="1.5" />
    </svg>
  );
}

/* ── single sortable row ── */
function SortableRow({ id, children, compact }: { id: string; children: ReactNode; compact?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          background: "#1a1a1a",
          border: isDragging ? "1px solid #EC6B15" : "1px solid #2a2a2a",
          borderRadius: 10,
          padding: compact ? "0.75rem" : "1rem 1.25rem",
          display: "flex",
          alignItems: compact ? "flex-start" : "center",
          gap: compact ? "0.65rem" : "1rem",
        }}
      >
        <div
          {...attributes}
          {...listeners}
          style={{
            cursor: "grab",
            padding: compact ? "0.5rem 0.15rem" : "0.25rem",
            display: "flex",
            alignItems: "center",
            touchAction: "none",
          }}
          title="Drag to reorder"
        >
          <GripIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── main wrapper ── */
type SortableListProps<T extends { id: string }> = {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
};

export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: SortableListProps<T>) {
  const isMobile = useIsMobile();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    onReorder(reordered);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id} compact={isMobile}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export { SortableRow };
