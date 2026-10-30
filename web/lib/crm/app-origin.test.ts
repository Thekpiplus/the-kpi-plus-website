import assert from "node:assert/strict";
import test from "node:test";
import { publicAppOrigin, publicAppUrl } from "./app-origin";

function request(url: string, headers: Record<string, string> = {}) {
  return new Request(url, { headers });
}

test("internal Hostinger request.url uses CRM_BASE_URL", () => {
  const previous = process.env.CRM_BASE_URL;
  process.env.CRM_BASE_URL = "https://kpimockup03.online";
  try {
    const req = request("http://127.0.0.1:8080/api/crm/login", { host: "127.0.0.1:8080" });
    assert.equal(publicAppOrigin(req), "https://kpimockup03.online");
    assert.equal(publicAppUrl("/crm", req).href, "https://kpimockup03.online/crm");
  } finally {
    if (previous == null) delete process.env.CRM_BASE_URL;
    else process.env.CRM_BASE_URL = previous;
  }
});

test("x-forwarded-host wins over 127.0.0.1 even without CRM_BASE_URL", () => {
  const previous = process.env.CRM_BASE_URL;
  delete process.env.CRM_BASE_URL;
  try {
    const origin = publicAppOrigin(
      request("http://127.0.0.1:8080/api/crm/login", {
        host: "127.0.0.1:8080",
        "x-forwarded-host": "kpimockup03.online",
        "x-forwarded-proto": "https",
      }),
    );
    assert.equal(origin, "https://kpimockup03.online");
  } finally {
    if (previous == null) delete process.env.CRM_BASE_URL;
    else process.env.CRM_BASE_URL = previous;
  }
});

test("localhost request host is kept even if CRM_BASE_URL points elsewhere", () => {
  const previous = process.env.CRM_BASE_URL;
  process.env.CRM_BASE_URL = "http://localhost:3000";
  try {
    const origin = publicAppOrigin(request("http://127.0.0.1:3001/api/crm/login", { host: "localhost:3001" }));
    assert.equal(origin, "http://localhost:3001");
  } finally {
    if (previous == null) delete process.env.CRM_BASE_URL;
    else process.env.CRM_BASE_URL = previous;
  }
});
