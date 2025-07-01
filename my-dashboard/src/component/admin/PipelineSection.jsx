// 🧩 PipelineSection.jsx
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  import { useState, useRef, useEffect } from 'react';
  import PipelineCard from './PipelineCard';
  import PipelineColumn from './PipelineColumn';
  import { motion } from 'framer-motion';
  import { toast } from 'react-hot-toast';
  import { supabase } from '../../lib/supabaseClient';
  
  const stages = [
    { title: 'Application Received', color: 'bg-teal-600' },
    { title: 'Pre-Approval Issued', color: 'bg-gray-500' },
    { title: 'In Processing', color: 'bg-cyan-500' },
    { title: 'Submitted to Underwriting', color: 'bg-rose-500' },
    { title: 'Conditional Approval', color: 'bg-amber-400' },
    { title: 'Docs Out / Scheduled to Close', color: 'bg-lime-500' },
    { title: 'Post-Close Follow-Up', color: 'bg-indigo-500' },
  ];
  
  const PipelineSection = ({ dataByStage, onMove }) => {
    const scrollRef = useRef(null);
    const [localData, setLocalData] = useState(dataByStage);
    const [overStage, setOverStage] = useState(null);
  
    const sensors = useSensors(useSensor(PointerSensor));
  
    useEffect(() => {
      const channel = supabase
        .channel('leads-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
          const updated = payload.new;
          setLocalData((prev) => {
            const newData = { ...prev };
            for (const stage of stages) {
              newData[stage.title] = newData[stage.title].filter((i) => i.name !== updated.name);
            }
            if (!newData[updated.stage]) newData[updated.stage] = [];
            newData[updated.stage].push(updated);
            return newData;
          });
        })
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, []);
  
    const scroll = (dir) => {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    };
  
    const syncToSupabase = async (item, newStage) => {
      const { error } = await supabase
        .from('leads')
        .update({ stage: newStage })
        .eq('name', item.name);
  
      if (error) {
        toast.error('❌ Failed to sync to Supabase');
      } else {
        toast.success(`✅ Moved to ${newStage}`);
      }
    };
  
    const handleDragEnd = (event) => {
      const { active, over } = event;
      setOverStage(null);
      if (!over || active.id === over.id) return;
  
      const fromStage = active.data.current.stage;
      const toStage = over.data.current.stage;
  
      if (fromStage === toStage) {
        const oldIndex = active.data.current.index;
        const newIndex = over.data.current.index;
  
        const newItems = [...localData[fromStage]];
        const [movedItem] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, movedItem);
  
        setLocalData({ ...localData, [fromStage]: newItems });
      } else {
        const item = localData[fromStage].find((i) => i.name === active.id);
        const updatedFrom = localData[fromStage].filter((i) => i.name !== active.id);
        const updatedTo = [item, ...localData[toStage]];
  
        setLocalData({
          ...localData,
          [fromStage]: updatedFrom,
          [toStage]: updatedTo,
        });
  
        toast.success(`Moved '${item.name}' to '${toStage}'`);
        syncToSupabase(item, toStage);
  
        if (onMove) onMove(item, fromStage, toStage);
      }
    };
  
    const handleDragOver = (event) => {
      const { over } = event;
      if (over && over.data?.current?.stage) {
        setOverStage(over.data.current.stage);
      } else {
        setOverStage(null);
      }
    };
  
    return (
      <section className="relative w-full space-y-4">
        <div className="sticky top-0 z-20 flex justify-between items-center bg-white dark:bg-gray-900 px-4 py-2 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">📊 Loan Pipeline</h2>
          <div className="flex gap-2">
            <button className="btn-outline" onClick={() => scroll('left')}>←</button>
            <button className="btn-outline" onClick={() => scroll('right')}>→</button>
          </div>
        </div>
  
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div ref={scrollRef} className="flex gap-4 px-4 py-4 overflow-x-auto snap-x snap-mandatory">
            {stages.map((stage, idx) => {
              const items = localData[stage.title] || [];
              const total = items.length;
              const onTrack = items.filter((c) => c.status === 'On Track').length;
              const progress = total > 0 ? Math.round((onTrack / total) * 100) : 0;
              const isOver = overStage === stage.title;
  
              return (
                <PipelineColumn
                  key={idx}
                  stage={stage}
                  items={items}
                  progress={progress}
                  lastUpdated="today"
                  isOver={isOver}
                />
              );
            })}
          </div>
        </DndContext>
      </section>
    );
  };
  
export default PipelineSection;
  