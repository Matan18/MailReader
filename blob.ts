import {
  decode,
} from "https://deno.land/std@0.74.0/encoding/base64url.ts";

export async function BufferToStringDeno(buff: string) {
  const Ab = decode(buff)
  const text = new TextDecoder().decode(Ab)
  return text
}