import { useState, useEffect, useRef, useId } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, ChevronUp, ExternalLink, FileText, Image as ImageIcon, Loader2, Plus, Trash2, TriangleAlert, Upload
} from 'lucide-react';
import { api } from '../services/api';
import { uploadCourseMaterial, uploadCourseCoverImage } from '../services/supabaseStorage';
import type { Course, Topic, Lesson } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { CourseCard } from '../components/shared/CourseCard';
import { BuilderActions } from '../components/admin/BuilderActions';
import { FormField } from '../components/admin/FormField';
import { FormSection } from '../components/admin/FormSection';
import { IconButton } from '../components/admin/RowActions';
import { PreviewFrame } from '../components/admin/PreviewFrame';
import { SwitchField } from '../components/admin/SwitchField';

const LESSON_TYPES: { value: Lesson['type']; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Texto' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Tarea' },
  { value: 'file', label: 'Archivo' },
];

// Dashed drop zones: one look for the cover image and for the materials
const dropZone =
  'flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-sand bg-mist px-4 py-6 text-center transition-colors hover:border-secondary hover:bg-sand/30 disabled:cursor-not-allowed disabled:opacity-50';

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
  const panelId = useId();
  const typeLabel = LESSON_TYPES.find((t) => t.value === lesson.type)?.label ?? lesson.type;

  return (
    <li className="rounded-2xl bg-mist ring-1 ring-sand/70">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors hover:bg-sand/30 sm:px-4"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white font-display text-xs font-bold text-iris">
          {index + 1}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-dark">{lesson.title || 'Nueva lección'}</span>
        <span className="chip hidden bg-white text-dark sm:inline-flex">{typeLabel}</span>
        <ChevronDown
          className={cn('size-5 shrink-0 text-dark/65 transition-transform', expanded && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div id={panelId} className="space-y-5 border-t border-sand/70 p-4 sm:p-5">
          <FormField label="Título de la lección">
            {(control) => (
              <input
                {...control}
                value={lesson.title}
                onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
                placeholder="Título de la lección"
                className="field bg-white"
              />
            )}
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Tipo">
              {(control) => (
                <select
                  {...control}
                  value={lesson.type}
                  onChange={(e) => onUpdate({ ...lesson, type: e.target.value as Lesson['type'] })}
                  className="field bg-white"
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              )}
            </FormField>
            <FormField label="Duración">
              {(control) => (
                <input
                  {...control}
                  value={lesson.duration}
                  onChange={(e) => onUpdate({ ...lesson, duration: e.target.value })}
                  placeholder="Ej: 10:00"
                  className="field bg-white"
                />
              )}
            </FormField>
          </div>

          <SwitchField
            label="Lección de vista previa"
            description="Se puede ver sin haber comprado el curso."
            checked={lesson.isPreview}
            onChange={(checked) => onUpdate({ ...lesson, isPreview: checked })}
          />

          {lesson.type === 'video' && (
            <FormField label="URL del video">
              {(control) => (
                <input
                  {...control}
                  value={lesson.videoUrl || ''}
                  onChange={(e) => onUpdate({ ...lesson, videoUrl: e.target.value })}
                  placeholder="URL del video"
                  className="field bg-white"
                />
              )}
            </FormField>
          )}

          <FormField label="Contenido de la lección">
            {(control) => (
              <textarea
                {...control}
                value={lesson.content || ''}
                onChange={(e) => onUpdate({ ...lesson, content: e.target.value })}
                placeholder="Contenido de la lección"
                rows={3}
                className="field min-h-24 resize-y bg-white"
              />
            )}
          </FormField>

          <button type="button" onClick={onDelete} className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50">
            <Trash2 className="size-4" aria-hidden="true" /> Eliminar lección
            <span className="sr-only"> {index + 1}</span>
          </button>
        </div>
      )}
    </li>
  );
}

/* ─── Topic Editor ─── */
function TopicEditor({
  topic,
  index,
  onUpdate,
  onDelete,
  onAddLesson,
}: {
  topic: Topic;
  index: number;
  onUpdate: (t: Topic) => void;
  onDelete: () => void;
  onAddLesson: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const titleId = useId();
  const bodyId = useId();

  return (
    <article className="card overflow-hidden">
      <header className="flex items-center gap-2 border-b border-sand/60 bg-mist p-3 sm:gap-3 sm:p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white font-display text-sm font-bold text-iris ring-1 ring-sand/70">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <label htmlFor={titleId} className="sr-only">
            Título del módulo {index + 1}
          </label>
          <input
            id={titleId}
            value={topic.title}
            onChange={(e) => onUpdate({ ...topic, title: e.target.value })}
            placeholder="Título del módulo"
            className="field bg-white font-medium"
          />
        </div>
        <IconButton
          icon={expanded ? ChevronUp : ChevronDown}
          label={expanded ? `Contraer el módulo ${index + 1}` : `Expandir el módulo ${index + 1}`}
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded(!expanded)}
        />
        <IconButton icon={Trash2} tone="danger" label={`Eliminar el módulo ${index + 1}`} onClick={onDelete} />
      </header>

      {expanded && (
        <div id={bodyId} className="space-y-5 p-4 sm:p-5">
          <FormField label="Resumen del módulo">
            {(control) => (
              <textarea
                {...control}
                value={topic.summary}
                onChange={(e) => onUpdate({ ...topic, summary: e.target.value })}
                placeholder="Resumen del módulo"
                rows={2}
                className="field min-h-20 resize-y"
              />
            )}
          </FormField>

          {topic.lessons.length > 0 ? (
            <ol aria-label={`Lecciones del módulo ${index + 1}`} className="space-y-3">
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
            </ol>
          ) : (
            <p className="rounded-2xl border border-dashed border-sand px-4 py-5 text-center text-sm text-dark/65">
              Este módulo todavía no tiene lecciones.
            </p>
          )}

          <button type="button" onClick={onAddLesson} className="btn btn-soft btn-sm min-h-11">
            <Plus className="size-4" aria-hidden="true" /> Agregar lección
          </button>
        </div>
      )}
    </article>
  );
}

/* ─── Preview ─── */
const PREVIEW_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%23f1eafe'/%3E%3C/svg%3E";

// The storefront card expects an instructor with a photo: the draft is completed only for the preview
function toPreviewCourse(c: Course): Course {
  const name = c.instructor.name.trim();
  return {
    ...c,
    slug: c.slug || 'vista-previa',
    title: c.title || 'Título del curso',
    // Same fallback as the storefront: a blank short text shows the long description
    shortDescription: c.shortDescription.trim() || c.description,
    instructor: {
      ...c.instructor,
      name: name || 'Instructor',
      avatar: c.instructor.avatar || (name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}` : PREVIEW_AVATAR),
    },
  };
}

function CourseSummary({ course }: { course: Course }) {
  const totalLessons = course.topics?.reduce((sum, t) => sum + (t.lessons?.length || 0), 0) || 0;
  const stats = [
    { label: 'Módulos', value: course.topics?.length || 0 },
    { label: 'Lecciones', value: totalLessons },
    { label: 'Materiales', value: course.courseMaterials?.length || 0 },
  ];

  return (
    <dl className="card grid grid-cols-3 gap-3 p-5 text-center">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse">
          <dt className="text-xs text-dark/65">{s.label}</dt>
          <dd className="font-display text-xl font-bold text-dark">{s.value}</dd>
        </div>
      ))}
    </dl>
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
  const labelId = useId();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slug = courseSlug.trim() || 'sin-slug';
    setUploading(true);
    try {
      const url = await uploadCourseCoverImage(file, slug);
      onChange(url);
      toast.success('Imagen subida');
    } catch (err) {
      toast.error(`Error subiendo imagen: ${(err as Error).message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div role="group" aria-labelledby={labelId}>
      <p id={labelId} className="mb-1.5 text-sm font-medium text-dark">
        Imagen de portada
      </p>
      <div className="space-y-4">
        {/* Preview */}
        {value ? (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl bg-sand/40">
              <img src={value} alt="Portada" className="h-44 w-full object-cover sm:h-56" />
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-dark/55">
                  <Loader2 className="size-7 animate-spin text-white" aria-hidden="true" />
                  <span className="sr-only">Subiendo...</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn btn-secondary btn-sm min-h-11"
              >
                <Upload className="size-4" aria-hidden="true" /> Cambiar imagen
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="btn btn-sm min-h-11 text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="size-4" aria-hidden="true" /> Quitar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(dropZone, 'min-h-44')}
          >
            {uploading ? (
              <>
                <Loader2 className="size-7 animate-spin text-iris" aria-hidden="true" />
                <span className="text-sm font-semibold text-dark">Subiendo...</span>
              </>
            ) : (
              <>
                <ImageIcon className="size-8 text-iris" aria-hidden="true" />
                <span className="text-sm font-semibold text-dark">Subir imagen de portada</span>
                <span className="text-xs text-dark/65">JPG, PNG o WebP. Recomendado 1280×720</span>
              </>
            )}
          </button>
        )}

        {/* Input URL manual como fallback */}
        <FormField label="O pegá una URL de imagen">
          {(control) => (
            <input
              {...control}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="field"
            />
          )}
        </FormField>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
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
      } catch (err) {
        toast.error(`Error subiendo "${file.name}": ${(err as Error).message}`);
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
    <FormSection
      title="Materiales descargables"
      description="Subí los archivos directamente desde acá. Se guardan en Supabase y aparecen en la pestaña Recursos del aula."
    >
      {/* Lista de materiales cargados */}
      {materials.length > 0 && (
        <ul aria-label="Materiales cargados" className="space-y-2">
          {materials.map((mat, i) => (
            <li key={i} className="flex items-center gap-2 rounded-2xl bg-mist py-1.5 pl-4 pr-2 ring-1 ring-sand/70">
              <FileText className="size-5 shrink-0 text-iris" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-dark" title={mat.name}>
                {mat.name}
              </span>
              <a
                href={mat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-iris transition-colors hover:bg-sand/40"
              >
                Ver
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only"> {mat.name} (se abre en otra pestaña)</span>
              </a>
              <IconButton icon={Trash2} tone="danger" label={`Quitar ${mat.name}`} onClick={() => handleRemove(i)} />
            </li>
          ))}
        </ul>
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
        className={cn(dropZone, 'min-h-28')}
      >
        {uploading ? (
          <>
            <Loader2 className="size-6 animate-spin text-iris" aria-hidden="true" />
            <span className="text-sm font-semibold text-dark">Subiendo...</span>
          </>
        ) : (
          <>
            <Upload className="size-6 text-iris" aria-hidden="true" />
            <span className="text-sm font-semibold text-dark">Subir archivos</span>
            <span className="text-xs text-dark/65">PDF, Word, Excel, PowerPoint, ZIP o imágenes. Podés elegir varios a la vez.</span>
          </>
        )}
      </button>
      {!courseSlug.trim() && (
        <p className="flex items-start gap-2 rounded-2xl bg-warning/50 px-4 py-3 text-sm text-dark">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Completá el slug del curso antes de subir archivos.
        </p>
      )}
    </FormSection>
  );
}

const modeButton = (active: boolean) =>
  cn(
    'min-h-11 rounded-full px-4 text-sm font-semibold transition-all',
    active ? 'bg-white text-dark shadow-soft' : 'text-dark/65 hover:text-dark',
  );

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
    syllabusIntro: '',
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
      if (!c) return;
      // The API fills a missing short text with the long description: the field stays blank then,
      // so saving does not copy the long text into it
      setCourse({ ...c, shortDescription: c.shortDescription === c.description ? '' : c.shortDescription });
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
    } catch (err) {
      toast.error((err as Error).message || 'Error al guardar');
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

  const saveLabel = saving ? 'Guardando...' : isNew ? 'Crear curso' : 'Guardar cambios';
  const handleCancel = () => navigate('/admin/cursos');

  return (
    <div className="animate-fade-in">
      <Link to="/admin/cursos" className="btn btn-ghost btn-sm -ml-3 mb-4 min-h-11">
        <ArrowLeft className="size-4" aria-hidden="true" /> Volver a cursos
      </Link>

      {/* Below lg the form and the preview take turns; from lg they sit side by side */}
      <div role="group" aria-label="Qué querés ver" className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-sand/40 p-1 lg:hidden">
        <button type="button" aria-pressed={!previewMode} onClick={() => setPreviewMode(false)} className={modeButton(!previewMode)}>
          Formulario
        </button>
        <button type="button" aria-pressed={previewMode} onClick={() => setPreviewMode(true)} className={modeButton(previewMode)}>
          Vista previa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className={cn('space-y-6', previewMode && 'max-lg:hidden')}>
          {/* Basic Info */}
          <FormSection title="Información básica">
            <FormField label="Título" required>
              {(control) => (
                <input
                  {...control}
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  placeholder="Ej: Sublimación Avanzada"
                  className="field"
                />
              )}
            </FormField>

            <FormField label="Slug (URL del curso)" hint="La dirección real se genera sola a partir del título. Acá solo nombra la carpeta de los archivos que subís.">
              {(control) => (
                <input
                  {...control}
                  value={course.slug}
                  onChange={(e) => setCourse({ ...course, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  placeholder="Ej: candy-bar-powerpoint"
                  className="field"
                />
              )}
            </FormField>

            <FormField
              label="Descripción corta"
              hint="Se muestra en las tarjetas del curso. Si la dejás vacía, se usa la descripción completa. Máximo 500 caracteres."
            >
              {(control) => (
                <input
                  {...control}
                  maxLength={500}
                  value={course.shortDescription}
                  onChange={(e) => setCourse({ ...course, shortDescription: e.target.value })}
                  placeholder="Breve descripción que aparece en listados"
                  className="field"
                />
              )}
            </FormField>

            <FormField label="Descripción completa">
              {(control) => (
                <textarea
                  {...control}
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Descripción detallada del curso"
                  rows={4}
                  className="field min-h-28 resize-y"
                />
              )}
            </FormField>

            <FormField
              label="Introducción del temario"
              hint="Va debajo del título del temario en la página del curso. Si la dejás vacía, se muestran los módulos, las lecciones y la duración. Máximo 500 caracteres."
            >
              {(control) => (
                <input
                  {...control}
                  maxLength={500}
                  value={course.syllabusIntro ?? ''}
                  onChange={(e) => setCourse({ ...course, syllabusIntro: e.target.value })}
                  placeholder="Un recorrido paso a paso por lo que vas a aprender"
                  className="field"
                />
              )}
            </FormField>

            <FormField label="Tags" hint="Separalos con comas.">
              {(control) => (
                <input
                  {...control}
                  value={course.tags.join(', ')}
                  onChange={(e) => setCourse({ ...course, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  placeholder="sublimación, poliéster, técnica"
                  className="field"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title="Precio y detalles">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Precio">
                {(control) => (
                  <input
                    {...control}
                    type="number"
                    min="0"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                    className="field"
                  />
                )}
              </FormField>
              <FormField label="Precio comparación" hint="El precio anterior, tachado. Es opcional.">
                {(control) => (
                  <input
                    {...control}
                    type="number"
                    min="0"
                    value={course.comparePrice || ''}
                    onChange={(e) => setCourse({ ...course, comparePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="field"
                    placeholder="Opcional"
                  />
                )}
              </FormField>
              <FormField label="Nivel">
                {(control) => (
                  <select
                    {...control}
                    value={course.level}
                    onChange={(e) => setCourse({ ...course, level: e.target.value as Course['level'] })}
                    className="field"
                  >
                    <option value="principiante">Principiante</option>
                    <option value="intermedio">Intermedio</option>
                    <option value="avanzado">Avanzado</option>
                  </select>
                )}
              </FormField>
              <FormField label="Modalidad">
                {(control) => (
                  <select
                    {...control}
                    value={course.modality}
                    onChange={(e) => setCourse({ ...course, modality: e.target.value as Course['modality'] })}
                    className="field"
                  >
                    <option value="online">Online</option>
                    <option value="presencial">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                  </select>
                )}
              </FormField>
              <FormField label="Duración">
                {(control) => (
                  <input
                    {...control}
                    value={course.duration}
                    onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                    placeholder="Ej: 10h"
                    className="field"
                  />
                )}
              </FormField>
            </div>
          </FormSection>

          {/* Media */}
          <FormSection title="Multimedia">
            <CoverImageUploader
              value={course.coverImage}
              courseSlug={course.slug}
              onChange={(url) => setCourse({ ...course, coverImage: url })}
            />

            <FormField label="URL de video intro (opcional)">
              {(control) => (
                <input
                  {...control}
                  value={course.videoPreviewUrl || ''}
                  onChange={(e) => setCourse({ ...course, videoPreviewUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="field"
                />
              )}
            </FormField>
          </FormSection>

          {/* Instructor */}
          <FormSection title="Instructor">
            <FormField label="Nombre">
              {(control) => (
                <input
                  {...control}
                  value={course.instructor.name}
                  onChange={(e) => setCourse({ ...course, instructor: { ...course.instructor, name: e.target.value } })}
                  placeholder="Nombre del instructor"
                  className="field"
                />
              )}
            </FormField>
          </FormSection>

          {/* What You'll Learn */}
          <FormSection title="Lo que vas a aprender" description="Todavía no se guarda.">
            <ul className="space-y-3">
              {course.whatYouWillLearn.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <label htmlFor={`learn-${i}`} className="sr-only">
                    Punto {i + 1}
                  </label>
                  <input
                    id={`learn-${i}`}
                    value={item}
                    onChange={(e) => updateWhatYouWillLearn(i, e.target.value)}
                    placeholder="Ej: Dominarás la técnica de sublimación"
                    className="field min-w-0 flex-1"
                  />
                  <IconButton icon={Trash2} tone="danger" label={`Quitar el punto ${i + 1}`} onClick={() => removeWhatYouWillLearn(i)} />
                </li>
              ))}
            </ul>
            <button type="button" onClick={addWhatYouWillLearn} className="btn btn-soft btn-sm min-h-11">
              <Plus className="size-4" aria-hidden="true" /> Agregar item
            </button>
          </FormSection>

          {/* Topics */}
          <FormSection title="Contenido del curso" description="Armá el curso en módulos y cada módulo en lecciones.">
            {course.topics.length > 0 ? (
              <div className="space-y-4">
                {course.topics.map((topic, ti) => (
                  <TopicEditor
                    key={topic.id}
                    topic={topic}
                    index={ti}
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
            ) : (
              <p className="rounded-2xl border border-dashed border-sand px-4 py-6 text-center text-sm text-dark/65">
                Todavía no hay módulos. Agregá el primero para empezar a cargar lecciones.
              </p>
            )}
            <button type="button" onClick={handleAddTopic} className="btn btn-soft min-h-11">
              <Plus className="size-5" aria-hidden="true" /> Agregar módulo
            </button>
          </FormSection>

          {/* Course Materials */}
          <CourseMaterialsSection
            materials={course.courseMaterials || []}
            courseSlug={course.slug}
            onChange={(updated) => setCourse({ ...course, courseMaterials: updated })}
          />
        </div>

        <aside aria-label="Acciones y vista previa" className={cn('space-y-6 lg:sticky lg:top-24', !previewMode && 'max-lg:hidden')}>
          <div className="card hidden p-5 lg:block">
            <BuilderActions layout="stack" saving={saving} saveLabel={saveLabel} onSave={handleSave} onCancel={handleCancel} />
          </div>

          <PreviewFrame note="Así se ve en la tienda. Se actualiza mientras escribís.">
            <CourseCard course={toPreviewCourse(course)} detailed />
          </PreviewFrame>
          <CourseSummary course={course} />
        </aside>
      </div>

      {/* Below lg the actions stay at the bottom of the screen, whichever of the two views is open */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-sand/60 bg-white/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <BuilderActions layout="row" saving={saving} saveLabel={saveLabel} onSave={handleSave} onCancel={handleCancel} />
      </div>
    </div>
  );
}
