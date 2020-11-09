import { listenAndServe } from "https://deno.land/std@0.74.0/http/server.ts";
import { fromFileUrl } from "https://deno.land/std@0.74.0/path/mod.ts";
import { BufferToStringDeno } from "./blob.ts";

listenAndServe({ port: 8080 }, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    const u = new URL("./index.html", import.meta.url);
    if (u.protocol.startsWith('http')) {
      fetch(u.href).then(async (resp) => {
        const body = new Uint8Array(await resp.arrayBuffer());
        return req.respond({
          status: resp.status,
          headers: new Headers({
            "content-type": "text/html",
          }),
          body
        })
      })
    } else {
      const file = await Deno.open(fromFileUrl(u))
      req.respond({
        status: 200,
        headers: new Headers({
          "content-type": "text/html"
        }),
        body: file
      })
    }
  }
  if (req.method === "GET" && req.url === "/favicon.ido") {
    req.respond({
      status: 302,
      headers: new Headers({
        location: "https://deno.land/favicon.ico"
      })
    })
  }
  if (req.method === "GET" && req.url === "/callback") {
    //Serve with hack
    const u = new URL("./callback.html", import.meta.url);
    if (u.protocol.startsWith("http")) {
      // server launched by deno run http(s)://.../server.ts,
      fetch(u.href).then(async (resp) => {
        const body = new Uint8Array(await resp.arrayBuffer());
        return req.respond({
          status: resp.status,
          headers: new Headers({
            "content-type": "text/html",
          }),
          body,
        });
      });
    } else {
      // server launched by deno run ./server.ts
      const file = await Deno.open(fromFileUrl(u));
      req.respond({
        status: 200,
        headers: new Headers({
          "content-type": "text/html",
        }),
        body: file,
      });
    }
  }
  if (req.method === "POST" && req.url === "/signin") {
    const decoder = new TextDecoder();
    const buf = (await Deno.readAll(req.body));
    const token = decoder.decode(buf)
    console.log(token);
    const profile = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    let email = await profile.body?.getReader().read().then(response => {
      const LogInfo = decoder.decode(response.value)
      console.log(JSON.parse(LogInfo).email)
      return JSON.parse(LogInfo).email
    })
    return req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "text/plain",
      }),
      body: email
    })
  }
  if (req.method === "POST" && req.url === '/decode') {
    const decoder = new TextDecoder();
    const buf = (await Deno.readAll(req.body));
    const token = decoder.decode(buf)
    const response = await BufferToStringDeno(token)

    return req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: response
    })
  }
})

console.log("chat server starting on :8080....");
