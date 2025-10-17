import fs from "fs";
import path from "path";
import webp from "webp-converter";

const quality = 90;
const inputRoot = path.join(process.cwd(), "origin");
const outputRoot = path.join(process.cwd(), "webp");
const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

webp.grant_permission();

const ensureDirectory = async (dirPath: string) => {
  await fs.promises.mkdir(dirPath, { recursive: true });
};

const convertFileToWebp = async (sourcePath: string) => {
  const relativePath = path.relative(inputRoot, sourcePath);
  const destinationDir = path.join(outputRoot, path.dirname(relativePath));
  const destinationPath = path
    .join(destinationDir, path.basename(relativePath))
    .replace(/\.(png|jpe?g)$/i, ".webp");

  if (fs.existsSync(destinationPath)) {
    console.log(`Skip (already exists): ${destinationPath}`);
    return;
  }

  await ensureDirectory(destinationDir);

  try {
    const result = await webp.cwebp(
      sourcePath,
      destinationPath,
      `-q ${quality}`
    );
    console.log(`Converted: ${sourcePath} → ${destinationPath}`, result);
  } catch (error) {
    console.error(`Failed: ${sourcePath}`, error);
  }
};

const walkAndConvert = async (currentDir: string) => {
  const entries = await fs.promises.readdir(currentDir, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      await walkAndConvert(entryPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!supportedExtensions.has(ext)) {
      continue;
    }

    if (!fs.existsSync(entryPath)) {
      console.warn(`Missing file: ${entryPath}`);
      continue;
    }

    await convertFileToWebp(entryPath);
  }
};

const convertAll = async () => {
  if (!fs.existsSync(inputRoot)) {
    console.error(`Input directory not found: ${inputRoot}`);
    return;
  }

  await ensureDirectory(outputRoot);

  try {
    await walkAndConvert(inputRoot);
    console.log("Conversion complete.");
  } catch (error) {
    console.error("Unexpected error during conversion.", error);
  }
};

convertAll();
