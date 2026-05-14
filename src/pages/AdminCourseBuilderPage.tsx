import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import type { Course, Topic, Lesson } from '../types';
import { toast } from 'sonner';

export default function AdminCourseBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getCourses().then((courses) => {
      const c = courses.find((c) => c.id === id);
      setCourse(c ?? null);
      setLoading(false);
    });
  }, [id]);

  const handleAddTopic = () => {
    if (!course) return;
    const newTopic: Topic = {
      id: `new-topic-${Date.now()}`,
      title: 'Nueva sección',
      summary: '',
      lessons: [],
      order: course.topics.length + 1,
    };
    setCourse({ ...course, topics: [...course.topics, newTopic] });
  };

  const handleAddLesson = (topicId: string) => {
    if (!course) return;
    const newLesson: Lesson = {
      id: `new-lesson-${Date.now()}`,
      title: 'Nueva lección',
      type: 'video',
      duration: '10:00',
      isPreview: false,
      order: 1,
    };
    setCourse({
      ...course,
      topics: course.topics.map((t) =>
        t.id === topicId ? { ...t, lessons: [...t.lessons, newLesson] } : t
      ),
    });
  };

  const handleSave = async () => {
    if (!course) return;
    await api.updateCourse(course.id, { topics: course.topics });
    toast.success('Curso guardado');
  };

  if (loading) return <div className="text-white/60">Cargando...</div>;
  if (!course) return <div className="text-white/60">Curso no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-white">Course Builder</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 transition-colors"
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>

      <div className="space-y-4">
        {course.topics.map((topic, _ti) => (
          <TopicBuilder
            key={topic.id}
            topic={topic}
            onUpdate={(updated) => {
              setCourse({
                ...course,
                topics: course.topics.map((t) => (t.id === topic.id ? updated : t)),
              });
            }}
            onAddLesson={() => handleAddLesson(topic.id)}
            onDelete={() => {
              setCourse({ ...course, topics: course.topics.filter((t) => t.id !== topic.id) });
            }}
          />
        ))}
      </div>

      <button
        onClick={handleAddTopic}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 py-4 text-sm font-medium text-white/60 hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" /> Agregar sección
      </button>
    </div>
  );
}

function TopicBuilder({
  topic,
  onUpdate,
  onAddLesson,
  onDelete,
}: {
  topic: Topic;
  onUpdate: (t: Topic) => void;
  onAddLesson: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="w-4 h-4 text-white/20" />
        <input
          value={topic.title}
          onChange={(e) => onUpdate({ ...topic, title: e.target.value })}
          className="flex-1 bg-transparent text-white font-medium focus:outline-none"
          placeholder="Título de la sección"
        />
        <button onClick={() => setExpanded(!expanded)} className="p-1 text-white/40 hover:text-white">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} className="p-1 text-white/40 hover:text-error">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {topic.lessons.map((lesson, _li) => (
            <LessonBuilder
              key={lesson.id}
              lesson={lesson}
              onUpdate={(updated) => {
                onUpdate({
                  ...topic,
                  lessons: topic.lessons.map((l) => (l.id === lesson.id ? updated : l)),
                });
              }}
              onDelete={() => {
                onUpdate({
                  ...topic,
                  lessons: topic.lessons.filter((l) => l.id !== lesson.id),
                });
              }}
            />
          ))}
          <button
            onClick={onAddLesson}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-2 text-xs font-medium text-white/40 hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-3 h-3" /> Agregar lección
          </button>
        </div>
      )}
    </div>
  );
}

function LessonBuilder({
  lesson,
  onUpdate,
  onDelete,
}: {
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
      <GripVertical className="w-3 h-3 text-white/20" />
      <input
        value={lesson.title}
        onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
        className="flex-1 bg-transparent text-white/80 text-sm focus:outline-none"
        placeholder="Título de la lección"
      />
      <select
        value={lesson.type}
        onChange={(e) => onUpdate({ ...lesson, type: e.target.value as Lesson['type'] })}
        className="bg-transparent text-white/60 text-xs border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
      >
        <option value="video" className="bg-dark">Video</option>
        <option value="text" className="bg-dark">Texto</option>
        <option value="quiz" className="bg-dark">Quiz</option>
        <option value="assignment" className="bg-dark">Asignación</option>
        <option value="file" className="bg-dark">Archivo</option>
      </select>
      <button onClick={onDelete} className="p-1 text-white/20 hover:text-error">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
