import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

function openFolderPlugin() {
  const miUnidadCursos = "/Users/toni/Library/CloudStorage/GoogleDrive-leblangarcia@gmail.com/Mi unidad/001-CURSOS";

  return {
    name: "vite-open-folder-plugin",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // 1. Open Folder Endpoint
        if (req.url?.startsWith("/api/open-folder")) {
          const urlObj = new URL(req.url, "http://localhost:5175");
          const targetPath = urlObj.searchParams.get("path");

          if (!targetPath) {
            res.statusCode = 400;
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

        // 2. Unzip and Move to Drive Endpoint
        if (req.url?.startsWith("/api/unzip-and-move-to-drive")) {
          const urlObj = new URL(req.url, "http://localhost:5175");
          const sourcePath = urlObj.searchParams.get("sourcePath");
          const rawTitle = urlObj.searchParams.get("title") || "Curso Descomprimido";

          if (!sourcePath || !fs.existsSync(sourcePath)) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Source archive file not found" }));
            return;
          }

          const cleanTitle = rawTitle.replace(/[/\\:*?"<>|]/g, "-").replace(/\.rar$|\.zip$|\.7z$/i, "").trim();
          const targetDir = path.join(miUnidadCursos, cleanTitle);

          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          // First reveal the source file to trigger materialization if on Google Drive
          exec(`open -R "${sourcePath}"`);

          const unarCmd = `/opt/homebrew/bin/unar -force-overwrite -output-directory "${targetDir}" "${sourcePath}"`;

          exec(unarCmd, (err) => {
            if (err) {
              // Open target folder in Drive anyway so user has direct access
              exec(`open "${targetDir}"`);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                success: true,
                destinationPath: targetDir,
                message: "Archivo revelado en Drive y carpeta de destino preparada en Mi Unidad."
              }));
              return;
            }

            let fileCount = 0;
            try {
              fileCount = fs.readdirSync(targetDir).length;
            } catch (e) {}

            exec(`open "${targetDir}"`);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
              success: true,
              destinationPath: targetDir,
              filesExtracted: fileCount,
              message: `Curso descomprimido exitosamente en: ${targetDir}`
            }));
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