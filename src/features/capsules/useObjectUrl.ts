import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useObjectUrl(blob?: Blob, imagePath?: string) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!blob && !imagePath) {
      setUrl(undefined);
      return undefined;
    }

    if (!blob && imagePath && supabase) {
      let active = true;
      void supabase.storage.from('capsule-images').createSignedUrl(imagePath, 60 * 60).then(({ data, error }) => {
        if (active) setUrl(error ? undefined : data?.signedUrl);
      });
      return () => { active = false; };
    }

    if (!blob) return undefined;

    const nextUrl = URL.createObjectURL(blob);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [blob, imagePath]);

  return url;
}
