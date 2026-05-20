import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpnukedjelyfoewpqwpr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET_MATERIALS = 'course-materials';
const BUCKET_IMAGES = 'course-images';

export interface UploadResult {
  name: string;
  url: string;
}

/**
 * Sube un archivo al bucket course-materials/<courseSlug>/<filename>
 * y devuelve la URL pública.
 */
export async function uploadCourseMaterial(
  file: File,
  courseSlug: string
): Promise<UploadResult> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._() -]/g, '_');
  const path = `${courseSlug}/${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET_MATERIALS)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET_MATERIALS).getPublicUrl(path);

  return {
    name: file.name,
    url: data.publicUrl,
  };
}

/**
 * Sube la imagen de portada de un curso a course-images/<courseSlug>/cover.<ext>
 * y devuelve la URL pública.
 */
export async function uploadCourseCoverImage(
  file: File,
  courseSlug: string
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${courseSlug}/cover.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_IMAGES)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET_IMAGES).getPublicUrl(path);

  return data.publicUrl;
}
