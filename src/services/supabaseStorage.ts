import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kpnukedjelyfoewpqwpr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET = 'course-materials';

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
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    name: file.name,
    url: data.publicUrl,
  };
}
