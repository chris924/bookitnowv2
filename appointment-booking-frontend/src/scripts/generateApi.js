import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";

const SPEC_URL = "http://localhost:8080/v3/api-docs";
const SPEC_FILE = "openapi.json";
const HASH_FILE = "openapi.md5";
const MAX_RETRIES = 30;

function md5(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


async function fetchSpec()
{
    for(let attempt = 1; attempt <= MAX_RETRIES; attempt++)
    {
        console.log(`📡 Fetching OpenAPI spec (attempt ${attempt}/${MAX_RETRIES})...`);
        try {
            execSync(`curl -s ${SPEC_URL} -o ${SPEC_FILE}`, { stdio: "inherit" });
            return true;
        } catch {
            console.error("❌ Failed to download OpenAPI spec. Is your backend running?");
            await sleep(5000);           
        }
    }
    console.error("❌ Backend unavailable after multiple attempts. Exiting.");
    process.exit(1);
}

async function main() {
  
    await fetchSpec();
  
    const spec = fs.readFileSync(SPEC_FILE);
    const newHash = md5(spec);
    const oldHash = fs.existsSync(HASH_FILE) ? fs.readFileSync(HASH_FILE, "utf8").trim() : "";

    if (newHash === oldHash) {
        console.log("✅ OpenAPI spec unchanged, skipping generation.");
        return;
    }

    console.log("⚙️  Generating API client...");
    execSync(
        `npx openapi-generator-cli generate -i ${SPEC_FILE} -g typescript-fetch -o src/API --skip-validate-spec`,
        { stdio: "inherit" }
    );

    fs.writeFileSync(HASH_FILE, newHash);
    console.log("✅ API client regenerated successfully!");
}

main();
