import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp, Play, Eye, EyeOff, Image as ImageIcon, Upload, FileText, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { uploadCourseMaterial, uploadCourseCoverImage } from '../services/supabaseStorage';
import type { Course, Topic, Lesson } from '../types';
import { toast } from 'sonner';

/* ─── Editor Input ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

/* ─── Lesson Editor ─── */
function LessonEditor({
  lesson,
  onUpdate,
  onDelete,
  index,
}: {
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
  onDelete: () => void;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="w-3.5 h-3.5 text-white/20" />
        <span className="text-xs text-white/40 w-5">{index + 1}</span>
        <span className="text-sm text-white/80 flex-1 truncate">{lesson.title || 'Nueva lección'}</span>
        <span className="text-xs text-white/40 capitalize">{lesson.type}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/40" /> : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/5">
          <div className="pt-2">
            <input
              value={lesson.title}
              onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
              placeholder="Título de la lección"
              className="w-full bg-transparent text-sm text-white border-b border-white/10 focus:border-primary/50 focus:outline-none py-1 placeholder:text-white/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={lesson.type}
              onChange={(e) => onUpdate({ ...lesson, type: e.target.value as Lesson['type'] })}
              className="bg-white/5 rounded-lg text-xs text-white border border-white/10 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="video">Video</option>
              <option value="text">Texto</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Tarea</option>
              <option value="file">Archivo</option>
            </select>
            <input
              value={lesson.duration}
              onChange={(e) => onUpdate({ ...lesson, duration: e.target.value })}
              placeholder="Duración"
              className="bg-white/5 rounded-lg text-xs text-white border border-white/10 px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
            />
            <label className="flex items-center gap-1.5 text-xs text-white/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lesson.isPreview}
                onChange={(e) => onUpdate({ ...lesson, isPreview: e.target.checked })}
                className="rounded border-white/30 bg-white/5 text-primary"
              />
              Preview
            </label>
          </div>
          {lesson.type === 'video' && (
            <input
              value={lesson.videoUrl || ''}
              onChange={(e) => onUpdate({ ...lesson, videoUrl: e.target.value })}
              placeholder="URL del video"
              className="w-full bg-transparent text-xs text-white border-b border-white/10 focus:border-primary/50 focus:outline-none py-1 placeholder:text-white/20"
            />
          )}
          <textarea
            value={lesson.content || ''}
            onChange={(e) => onUpdate({ ...lesson, content: e.target.value })}
            placeholder="Contenido de la lección"
            rows={3}
            className="w-full bg-white/5 rounded-lg text-xs text-white border border-white/10 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 resize-none"
          />
          <button onClick={onDelete} className="text-xs text-error/70 hover:text-error flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Eliminar lección
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Topic Editor ─── */
function TopicEditor({
  topic,
  onUpdate,
  onDelete,
  onAddLesson,
}: {
  topic: Topic;
  onUpdate: (t: Topic) => void;
  onDelete: () => void;
  onAddLesson: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <GripVertical className="w-4 h-4 text-white/20" />
        <input
          value={topic.title}
          onChange={(e) => onUpdate({ ...topic, title: e.target.value })}
          placeholder="Título de la sección"
          className="flex-1 bg-transparent text-sm font-medium text-white border-b border-transparent focus:border-primary/50 focus:outline-none placeholder:text-white/30"
        />
        <button onClick={() => setExpanded(!expanded)} className="p-1 text-white/30 hover:text-white/60">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} className="p-1 text-error/40 hover:text-error/80">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-2">
          <textarea
            value={topic.summary}
            onChange={(e) => onUpdate({ ...topic, summary: e.target.value })}
            placeholder="Resumen de la sección"
            rows={2}
            className="w-full bg-white/5 rounded-lg text-xs text-white border border-white/10 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-white/20 resize-none mb-2"
          />
          <div className="space-y-2">
            {topic.lessons.map((lesson, li) => (
              <LessonEditor
                key={lesson.id}
                lesson={lesson}
                index={li}
                onUpdate={(updated) => {
                  onUpdate({
                    ...topic,
                    lessons: topic.lessons.map((l) => (l.id === lesson.id ? updated : l)),
                  });
                }}
                onDelete={() => {
                  onUpdate({ ...topic, lessons: topic.lessons.filter((l) => l.id !== lesson.id) });
                }}
              />
            ))}
          </div>
          <button
            onClick={onAddLesson}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 py-2 text-xs font-medium text-white/50 hover:border-primary/50 hover:text-primary transition-colors mt-2"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar lección
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Course Preview ─── */
function CoursePreview({ course }: { course: Course }) {
  const [playingPreview, setPlayingPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview');
  const totalLessons = course.topics?.reduce((sum, t) => sum + (t.lessons?.length || 0), 0) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      {/* Cover */}
      <div className="aspect-video bg-dark relative shrink-0">
        {playingPreview && course.videoPreviewUrl ? (
          <iframe
            src={course.videoPreviewUrl?.replace('watch?v=', 'embed/')}
            className="w-full h-full"
            allowFullScreen
            title="Preview"
          />
        ) : (
          <>
            {course.coverImage ? (
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sand/20">
                <ImageIcon className="w-12 h-12 text-sand/40" />
              </div>
            )}
            {course.videoPreviewUrl && (
              <button
                onClick={() => setPlayingPreview(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <Play className="w-6 h-6 text-dark ml-1" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-primary">${course.price}</span>
          {course.comparePrice ? (
            <span className="text-base text-dark/40 line-through">${course.comparePrice}</span>
          ) : null}
        </div>

        <h1 className="font-display text-xl font-bold text-dark mb-2">{course.title || 'Sin título'}</h1>
        <p className="text-sm text-dark/60 mb-4">{course.description || 'Sin descripción'}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg capitalize">{course.level}</span>
          <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg capitalize">{course.modality}</span>
          <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg">{course.duration}</span>
          <span className="text-xs bg-sand/50 text-dark/70 px-2 py-1 rounded-lg">{totalLessons} lecciones</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-sand/50 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-dark/40'}`}
          >
            Vista previa
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-primary text-primary' : 'border-transparent text-dark/40'}`}
          >
            Contenido ({totalLessons})
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-3">
            {course.whatYouWillLearn?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-dark mb-2">Lo que vas a aprender</h3>
                <div className="grid grid-cols-1 gap-1.5">
                  {course.whatYouWillLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-dark/70">
                      <span className="text-success mt-0.5">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {course.instructor?.name && (
              <div className="flex items-center gap-3 mt-4 p-3 bg-sand/20 rounded-xl">
                <img
                  src={course.instructor.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(course.instructor.name)}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-dark">{course.instructor.name}</p>
                  <p className="text-xs text-dark/50">Instructor</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-3">
            {course.topics?.map((topic) => (
              <div key={topic.id} className="rounded-xl border border-sand/30 overflow-hidden">
                <div className="bg-sand/10 px-3 py-2">
                  <h4 className="text-sm font-medium text-dark">{topic.title}</h4>
                  {topic.summary && <p className="text-xs text-dark/50">{topic.summary}</p>}
                </div>
                <div className="divide-y divide-sand/20">
                  {topic.lessons?.map((lesson, li) => (
                    <div key={lesson.id} className="flex items-center gap-2 px-3 py-2 text-xs text-dark/70">
                      <span className="text-dark/30 w-4">{li + 1}</span>
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className="text-dark/40">{lesson.duration}</span>
                      {lesson.isPreview && (
                        <span className="text-xs text-primary font-medium">Preview</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Cover Image Uploader ─── */
function CoverImageUploader({
  value,
  courseSlug,
  onChange,
}: {
  value: string;
  courseSlug: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slug = courseSlug.trim() || 'sin-slug';
    setUploading(true);
    try {
      const url = await uploadCourseCoverImage(file, slug);
      onChange(url);
      toast.success('Imagen subida');
    } catch (err: any) {
      toast.error(`Error subiendo imagen: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <Field label="Imagen de portada">
      <div className="space-y-3">
        {/* Preview */}
        {value ? (
          <div className="relative group rounded-xl overflow-hidden">
            <img src={value} alt="Portada" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-dark hover:bg-white transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Cambiar
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1.5 rounded-lg bg-error/80 px-3 py-1.5 text-xs font-medium text-white hover:bg-error transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Quitar
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-44 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 hover:border-primary hover:text-primary text-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">Subiendo...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs font-medium">Subir imagen de portada</span>
                <span className="text-xs opacity-60">JPG, PNG — recomendado 1280×720</span>
              </>
            )}
          </button>
        )}

        {/* Input URL manual como fallback */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="O pegá una URL de imagen..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Field>
  );
}

/* ─── Course Materials Section ─── */
function CourseMaterialsSection({
  materials,
  courseSlug,
  onChange,
}: {
  materials: { name: string; url: string }[];
  courseSlug: string;
  onChange: (updated: { name: string; url: string }[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const slug = courseSlug.trim() || 'sin-slug';
    setUploading(true);

    const results: { name: string; url: string }[] = [];
    for (const file of files) {
      try {
        const result = await uploadCourseMaterial(file, slug);
        results.push(result);
        toast.success(`"${file.name}" subido`);
      } catch (err: any) {
        toast.error(`Error subiendo "${file.name}": ${err.message}`);
      }
    }

    onChange([...materials, ...results]);
    setUploading(false);
    // reset input so the same file puede subirse de nuevo si hace falta
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    onChange(materials.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Materiales descargables</h2>
      <p className="text-xs text-white/30">
        Subí los archivos directamente desde acá. Se guardan en Supabase y aparecen en la pestaña Recursos del aula.
      </p>

      {/* Lista de materiales cargados */}
      {materials.length > 0 && (
        <div className="space-y-2">
          {materials.map((mat, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <FileText className="w-4 h-4 text-primary/70 shrink-0" />
              <span className="flex-1 text-sm text-white/80 truncate">{mat.name}</span>
              <a
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-primary transition-colors shrink-0"
              >
                Ver
              </a>
              <button
                onClick={() => handleRemove(i)}
                className="p-1 text-error/40 hover:text-error transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Botón de upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.pptx,.ppt,.docx,.doc,.xlsx,.xls,.zip,.png,.jpg,.jpeg"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 py-4 text-sm font-medium text-white/50 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Subir archivos
          </>
        )}
      </button>
      {!courseSlug.trim() && (
        <p className="text-xs text-warning/70">
          Completá el slug del curso antes de subir archivos.
        </p>
      )}
    </section>
  );
}

/* ─── Main Page ─── */
export default function AdminCourseBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'nuevo';
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [course, setCourse] = useState<Course>({
    id: '',
    slug: '',
    title: '',
    description: '',
    shortDescription: '',
    whatYouWillLearn: [''],
    requirements: [],
    instructor: { id: '', name: '', avatar: '', bio: '', expertise: [], coursesCount: 0, studentsCount: 0, rating: 0 },
    price: 0,
    comparePrice: undefined,
    coverImage: '',
    videoPreviewUrl: '',
    level: 'principiante',
    modality: 'online',
    duration: '',
    language: 'es',
    certificate: true,
    topics: [],
    includes: ['Acceso de por vida', 'Certificado de finalización', 'Material descargable'],
    tags: [],
    rating: 0,
    reviewsCount: 0,
    enrolledCount: 0,
    featured: false,
    courseMaterials: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (isNew) return;
    api.getCourseById(id!).then((c) => {
      if (c) setCourse(c);
    });
  }, [id, isNew]);

  const handleAddTopic = () => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: 'Nueva sección',
      summary: '',
      lessons: [],
      order: course.topics.length + 1,
    };
    setCourse({ ...course, topics: [...course.topics, newTopic] });
  };

  const handleAddLesson = (topicId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
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
    if (!course.title) {
      toast.error('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await api.createCourse(course);
        toast.success('Curso creado');
      } else {
        await api.updateCourse(course.id, course);
        toast.success('Curso actualizado');
      }
      navigate('/admin/cursos');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateWhatYouWillLearn = (index: number, value: string) => {
    const updated = [...course.whatYouWillLearn];
    updated[index] = value;
    setCourse({ ...course, whatYouWillLearn: updated });
  };

  const addWhatYouWillLearn = () => {
    setCourse({ ...course, whatYouWillLearn: [...course.whatYouWillLearn, ''] });
  };

  const removeWhatYouWillLearn = (index: number) => {
    setCourse({ ...course, whatYouWillLearn: course.whatYouWillLearn.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-dark/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-semibold text-white">
            {isNew ? 'Nuevo curso' : 'Editar curso'}
          </h1>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${previewMode ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? 'Editar' : 'Preview'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/cursos')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : isNew ? 'Crear curso' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 overflow-y-auto ${previewMode ? 'hidden lg:block lg:w-1/2' : 'w-full'}`}>
          <div className="max-w-2xl mx-auto p-6 space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Información básica</h2>
              
              <Field label="Título">
                <input
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  placeholder="Ej: Sublimación Avanzada"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              <Field label="Slug (URL del curso)">
                <input
                  value={course.slug}
                  onChange={(e) => setCourse({ ...course, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  placeholder="Ej: candy-bar-powerpoint"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              <Field label="Descripción corta">
                <input
                  value={course.shortDescription}
                  onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })}
                  placeholder="Breve descripción que aparece en listados"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              <Field label="Descripción completa">
                <textarea
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Descripción detallada del curso"
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio">
                  <input
                    type="number"
                    min="0"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </Field>
                <Field label="Precio comparación">
                  <input
                    type="number"
                    min="0"
                    value={course.comparePrice || ''}
                    onChange={(e) => setCourse({ ...course, comparePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Opcional"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Nivel">
                  <select
                    value={course.level}
                    onChange={(e) => setCourse({ ...course, level: e.target.value as Course['level'] })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                </Field>
                <Field label="Modalidad">
                  <select
                    value={course.modality}
                    onChange={(e) => setCourse({ ...course, modality: e.target.value as Course['modality'] })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="online">Online</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                </Field>
                <Field label="Duración">
                  <input
                    value={course.duration}
                    onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                    placeholder="Ej: 10h"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </Field>
              </div>
            </section>

            {/* Media */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Multimedia</h2>

              <CoverImageUploader
                value={course.coverImage}
                courseSlug={course.slug}
                onChange={(url) => setCourse({ ...course, coverImage: url })}
              />

              <Field label="URL de video intro (opcional)">
                <input
                  value={course.videoPreviewUrl || ''}
                  onChange={(e) => setCourse({ ...course, videoPreviewUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>
            </section>

            {/* Instructor */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Instructor</h2>
              <Field label="Nombre">
                <input
                  value={course.instructor.name}
                  onChange={(e) => setCourse({ ...course, instructor: { ...course.instructor, name: e.target.value } })}
                  placeholder="Nombre del instructor"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>
            </section>

            {/* What You'll Learn */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Lo que vas a aprender</h2>
              <div className="space-y-2">
                {course.whatYouWillLearn.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(e) => updateWhatYouWillLearn(i, e.target.value)}
                      placeholder="Ej: Dominarás la técnica de sublimación"
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => removeWhatYouWillLearn(i)}
                      className="p-2 text-error/50 hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addWhatYouWillLearn}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar item
              </button>
            </section>

            {/* Topics */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Contenido del curso</h2>
              <div className="space-y-3">
                {course.topics.map((topic) => (
                  <TopicEditor
                    key={topic.id}
                    topic={topic}
                    onUpdate={(updated) => {
                      setCourse({ ...course, topics: course.topics.map((t) => (t.id === topic.id ? updated : t)) });
                    }}
                    onDelete={() => {
                      setCourse({ ...course, topics: course.topics.filter((t) => t.id !== topic.id) });
                    }}
                    onAddLesson={() => handleAddLesson(topic.id)}
                  />
                ))}
              </div>
              <button
                onClick={handleAddTopic}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 py-4 text-sm font-medium text-white/60 hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" /> Agregar sección
              </button>
            </section>

            {/* Tags */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Tags</h2>
              <input
                value={course.tags.join(', ')}
                onChange={(e) => setCourse({ ...course, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                placeholder="sublimación, poliéster, técnica"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </section>

            {/* Course Materials */}
            <CourseMaterialsSection
              materials={course.courseMaterials || []}
              courseSlug={course.slug}
              onChange={(updated) => setCourse({ ...course, courseMaterials: updated })}
            />
          </div>
        </div>

        {/* Preview */}
        {(previewMode || !previewMode) && (
          <div className={`${previewMode ? 'w-full lg:w-1/2' : 'hidden lg:block lg:w-[480px] xl:w-[560px]'} border-l border-white/10 overflow-hidden bg-sand/5`}>
            <div className="h-full overflow-y-auto p-4">
              <div className="sticky top-0 z-10 mb-3 flex items-center gap-2">
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  Vista del cliente
                </span>
              </div>
              <CoursePreview course={course} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
