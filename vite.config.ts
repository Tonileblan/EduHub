import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

function openFolderPlugin() {
  const miUnidadCursos = "/Users/toni/Library/CloudStorage/GoogleDrive-leblangarcia@gmail.com/Mi unidad/001-CURSOS";

  function cleanTitle(raw: string) {
    if (!raw) return "Curso";
    return raw
      .replace(/^[@]?[0-9️⃣🔟._ -]+/, "")
      .replace(/@cursosp0rmega/gi, "")
      .replace(/@MEMBRESIATPC/gi, "")
      .replace(/@TUSCURSOSFULL/gi, "")
      .replace(/\[.*?\]/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[._-]+/g, " ")
      .replace(/[/\\:*?"<>|]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return {
    name: "vite-open-folder-plugin",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // 1. Open Folder in Finder
        if (req.url?.startsWith("/api/open-folder")) {
          const urlObj = new URL(req.url, "http://localhost:5173");
          const targetPath = urlObj.searchParams.get("path");

          if (!targetPath) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Missing path parameter" }));
            return;
          }

          exec(`open -R "${targetPath}" || open "${targetPath}"`, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true, path: targetPath }));
          });
          return;
        }

        // 2. Check Prepared Status in Google Drive
        if (req.url?.startsWith("/api/check-prepared-status")) {
          const urlObj = new URL(req.url, "http://localhost:5173");
          const title = urlObj.searchParams.get("title") || "";
          const safeT = cleanTitle(title);

          const candidate1 = path.join(miUnidadCursos, "00-IA-CURSOS", safeT);
          const candidate2 = path.join(miUnidadCursos, safeT);

          const isPrepared = (fs.existsSync(candidate1) && fs.readdirSync(candidate1).length > 0) ||
                             (fs.existsSync(candidate2) && fs.readdirSync(candidate2).length > 0);

          const finalPath = fs.existsSync(candidate1) ? candidate1 : candidate2;

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({
            isPrepared,
            destinationPath: isPrepared ? finalPath : null,
            webUrl: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(safeT)}`
          }));
          return;
        }

        // 3. Prepare Course in Drive (1-Click Pipeline)
        if (req.url?.startsWith("/api/unzip-and-move-to-drive") || req.url?.startsWith("/api/prepare-course-in-drive")) {
          const urlObj = new URL(req.url, "http://localhost:5173");
          const courseId = urlObj.searchParams.get("courseId") || "";
          const sourcePath = urlObj.searchParams.get("sourcePath") || "";
          const rawTitle = urlObj.searchParams.get("title") || "Curso";
          const category = urlObj.searchParams.get("category") || "";

          let cmd = `node scripts/auto_prepare_course_in_drive.js`;
          if (courseId) cmd += ` --id "${courseId}"`;
          if (rawTitle) cmd += ` --title "${rawTitle}"`;
          if (category) cmd += ` --category "${category}"`;
          if (sourcePath) cmd += ` --source "${sourcePath}"`;

          exec(cmd, (err, stdout, stderr) => {
            res.setHeader("Content-Type", "application/json");
            try {
              // Extract JSON from output
              const jsonMatch = stdout.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                res.statusCode = 200;
                res.end(jsonMatch[0]);
                return;
              }
            } catch (e) {}

            if (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: stderr || err.message, output: stdout }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: "Curso preparado con éxito en Google Drive", output: stdout }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), openFolderPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts"
  }
});